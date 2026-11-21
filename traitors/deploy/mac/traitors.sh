#!/bin/bash
# Run the Traitors game server and a free Cloudflare tunnel as always-on
# background services on a Mac (they start at login and restart if they crash).
#
#   ./deploy/mac/traitors.sh install [--password YOUR-PASSWORD] [--port 3000]
#   ./deploy/mac/traitors.sh status      # shows the public link + admin password
#   ./deploy/mac/traitors.sh restart
#   ./deploy/mac/traitors.sh logs
#   ./deploy/mac/traitors.sh uninstall
set -euo pipefail

SERVER_LABEL="com.traitors.server"
TUNNEL_LABEL="com.traitors.tunnel"
AGENTS_DIR="$HOME/Library/LaunchAgents"
LOG_DIR="$HOME/Library/Logs/traitors"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DATA_DIR="$APP_DIR/data"
PORT_FILE="$DATA_DIR/port"

die() { echo "Error: $*" >&2; exit 1; }
say() { echo "==> $*"; }

# sed rather than ${var//}: bash versions disagree on what "&" means in replacements.
xml_escape() {
  printf '%s' "$1" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' -e 's/"/\&quot;/g'
}

current_port() {
  if [[ -f "$PORT_FILE" ]]; then cat "$PORT_FILE"; else echo 3000; fi
}

# plist LABEL LOGNAME "ENV_KEY=VALUE<newline>..." -- PROGRAM ARGS...
plist() {
  local label="$1" logname="$2" envs="$3"; shift 4
  cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$(xml_escape "$label")</string>
  <key>ProgramArguments</key>
  <array>
EOF
  local a
  for a in "$@"; do echo "    <string>$(xml_escape "$a")</string>"; done
  echo "  </array>"
  echo "  <key>EnvironmentVariables</key>"
  echo "  <dict>"
  local kv
  while IFS= read -r kv; do
    [[ -z "$kv" ]] && continue
    echo "    <key>$(xml_escape "${kv%%=*}")</key><string>$(xml_escape "${kv#*=}")</string>"
  done <<< "$envs"
  cat <<EOF
  </dict>
  <key>WorkingDirectory</key><string>$(xml_escape "$APP_DIR")</string>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>10</integer>
  <key>StandardOutPath</key><string>$(xml_escape "$LOG_DIR/$logname.log")</string>
  <key>StandardErrorPath</key><string>$(xml_escape "$LOG_DIR/$logname.log")</string>
</dict>
</plist>
EOF
}

server_plist() {
  local node="$1" port="$2" password="$3"
  local envs="PORT=$port"$'\n'"TRAITORS_DATA_DIR=$DATA_DIR"
  if [[ -n "$password" ]]; then envs="$envs"$'\n'"TRAITORS_ADMIN_PASSWORD=$password"; fi
  plist "$SERVER_LABEL" server "$envs" -- "$node" "$APP_DIR/start.js"
}

tunnel_plist() {
  local cloudflared="$1" port="$2"
  # 127.0.0.1 rather than "localhost": the server listens on IPv4 only.
  plist "$TUNNEL_LABEL" tunnel "HOME=$HOME" -- "$cloudflared" tunnel --no-autoupdate --url "http://127.0.0.1:$port"
}

load_agent() {
  local label="$1" file="$AGENTS_DIR/$1.plist" domain="gui/$(id -u)"
  launchctl bootout "$domain/$label" 2>/dev/null || launchctl unload "$file" 2>/dev/null || true
  launchctl bootstrap "$domain" "$file" 2>/dev/null || launchctl load -w "$file"
}

unload_agent() {
  local label="$1" file="$AGENTS_DIR/$1.plist"
  launchctl bootout "gui/$(id -u)/$label" 2>/dev/null || launchctl unload "$file" 2>/dev/null || true
}

tunnel_url() {
  [[ -f "$LOG_DIR/tunnel.log" ]] || return 0
  grep -Eo 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_DIR/tunnel.log" | tail -1 || true
}

admin_password() {
  local p
  p=$(/usr/libexec/PlistBuddy -c "Print :EnvironmentVariables:TRAITORS_ADMIN_PASSWORD" "$AGENTS_DIR/$SERVER_LABEL.plist" 2>/dev/null || true)
  if [[ -z "$p" && -f "$DATA_DIR/admin.json" ]]; then
    p=$(sed -E 's/.*"password":"([^"]*)".*/\1/' "$DATA_DIR/admin.json")
  fi
  echo "${p:-(not created yet: check again in a few seconds)}"
}

check_sleep() {
  local sleep
  sleep=$(pmset -g 2>/dev/null | awk '$1 == "sleep" {print $2}' || true)
  if [[ -n "$sleep" && "$sleep" != "0" ]]; then
    echo
    echo "  Warning: this Mac is set to sleep after $sleep minute(s); the game will stop when it sleeps."
    echo "  Fix it with:   sudo pmset -a sleep 0 autorestart 1"
    echo "  (or System Settings > Energy > 'Prevent automatic sleeping')"
  fi
}

cmd_install() {
  [[ "$(uname)" == "Darwin" ]] || die "this script is for macOS."
  local password="" port=3000
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --password) password="${2:-}"; shift 2 ;;
      --port) port="${2:-}"; shift 2 ;;
      *) die "unknown option: $1" ;;
    esac
  done
  [[ "$port" =~ ^[0-9]+$ ]] || die "--port must be a number"
  if [[ "$password" =~ [[:space:]] ]]; then die "the password can't contain spaces"; fi

  local node cloudflared
  node=$(command -v node || true)
  [[ -n "$node" ]] || die "Node.js is not installed. Run:  brew install node"
  local major
  major=$("$node" -p 'process.versions.node.split(".")[0]')
  (( major >= 18 )) || die "Node.js 18+ is needed (found $("$node" -v)). Run:  brew upgrade node"
  cloudflared=$(command -v cloudflared || true)
  [[ -n "$cloudflared" ]] || die "cloudflared is not installed. Run:  brew install cloudflared"
  if [[ -f "$HOME/.cloudflared/config.yml" || -f "$HOME/.cloudflared/config.yaml" ]]; then
    echo "  Note: ~/.cloudflared/config.yml exists. Quick tunnels don't work with it; rename it if the link never appears."
  fi

  mkdir -p "$AGENTS_DIR" "$LOG_DIR" "$DATA_DIR"
  echo "$port" > "$PORT_FILE"
  : > "$LOG_DIR/tunnel.log"

  say "Installing background services"
  server_plist "$node" "$port" "$password" > "$AGENTS_DIR/$SERVER_LABEL.plist"
  tunnel_plist "$cloudflared" "$port" > "$AGENTS_DIR/$TUNNEL_LABEL.plist"
  chmod 600 "$AGENTS_DIR/$SERVER_LABEL.plist"
  plutil -lint "$AGENTS_DIR/$SERVER_LABEL.plist" "$AGENTS_DIR/$TUNNEL_LABEL.plist" >/dev/null
  load_agent "$SERVER_LABEL"
  load_agent "$TUNNEL_LABEL"

  say "Waiting for the public link (up to 30 seconds)..."
  local i
  for i in $(seq 1 30); do
    [[ -n "$(tunnel_url)" ]] && break
    sleep 1
  done
  cmd_status
}

cmd_status() {
  local port url health="NOT responding"
  port=$(current_port)
  if curl -fsS --max-time 3 "http://127.0.0.1:$port/api/health" >/dev/null 2>&1; then health="running"; fi
  url=$(tunnel_url)
  echo
  echo "  Game server:     $health (port $port)"
  if [[ -n "$url" ]]; then
    echo "  Players join at: $url"
    echo "  Host / admin:    $url/admin"
    echo "  TV screen:       $url/screen"
  else
    echo "  Public link:     not ready yet (run this again in a moment, or see: $0 logs)"
  fi
  echo "  At home:         http://$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo localhost):$port/"
  echo "  Admin password:  $(admin_password)"
  echo
  echo "  The free link changes whenever the tunnel restarts (e.g. after a reboot)."
  echo "  Run '$0 status' on game night to get the current one."
  check_sleep
}

cmd_restart() {
  : > "$LOG_DIR/tunnel.log"
  load_agent "$SERVER_LABEL"
  load_agent "$TUNNEL_LABEL"
  say "Restarted. Waiting for the new link..."
  local i
  for i in $(seq 1 30); do
    [[ -n "$(tunnel_url)" ]] && break
    sleep 1
  done
  cmd_status
}

cmd_logs() {
  echo "--- server ($LOG_DIR/server.log) ---"
  tail -n 40 "$LOG_DIR/server.log" 2>/dev/null || echo "(empty)"
  echo "--- tunnel ($LOG_DIR/tunnel.log) ---"
  tail -n 20 "$LOG_DIR/tunnel.log" 2>/dev/null || echo "(empty)"
}

cmd_uninstall() {
  unload_agent "$TUNNEL_LABEL"
  unload_agent "$SERVER_LABEL"
  rm -f "$AGENTS_DIR/$TUNNEL_LABEL.plist" "$AGENTS_DIR/$SERVER_LABEL.plist"
  say "Services removed. Game data is still in $DATA_DIR"
}

case "${1:-}" in
  install) shift; cmd_install "$@" ;;
  status) cmd_status ;;
  restart) cmd_restart ;;
  logs) cmd_logs ;;
  uninstall) cmd_uninstall ;;
  # Used by the test suite to check the generated files on any OS.
  print-plists) server_plist "${2:-/usr/local/bin/node}" "${3:-3000}" "${4:-}"; tunnel_plist "/usr/local/bin/cloudflared" "${3:-3000}" ;;
  *) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
