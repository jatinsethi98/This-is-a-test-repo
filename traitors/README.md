# The Traitors: party game server

A small website you run on your laptop. Everyone on the same Wi-Fi opens it on their phone, joins with their name, sees their secret role and votes at the Round Table. You run the game from an admin panel. A third page is meant for a TV or projector.

It has **no dependencies**. All you need is [Node.js](https://nodejs.org) 18 or newer, and there's nothing to `npm install`.

## Start it

```bash
cd traitors
npm start
```

The terminal prints something like this:

```
  Players join at:   http://192.168.1.23:3000/
  Host / admin:      http://192.168.1.23:3000/admin
  TV / big screen:   http://192.168.1.23:3000/screen
  Admin password:    raven-4821
```

- Send the **players link** to everyone, or put `/screen` on a TV: it shows a QR code to scan.
- Open **/admin** on your laptop and log in with the password. The password is saved in `data/admin.json`. To pick your own, start with `npm start -- --password mysecret`.
- To use a different port: `npm start -- --port 4000`. If port 3000 is busy, the server tries the next few ports on its own.

### Before your guests arrive (important)

1. **Firewall:** the first time you start it, macOS or Windows asks whether to allow incoming connections for Node. Click **Allow**. On Windows, tick **Private networks**.
2. **Same Wi-Fi:** phones must be on the same network as the laptop, not on mobile data or a guest network. Some guest networks block devices from seeing each other.
3. **Keep the laptop awake and plugged in**, and keep the terminal window open.
4. Do a test run: join from your own phone, then open `/admin` and `/screen`.

## How a game goes

1. **Lobby:** everyone joins with their name. In the admin panel, click **Randomly assign roles** (about 1 Traitor for every 4–5 players) or set roles by hand. Then click **Start the game**.
2. Each player taps **"Tap to see your secret role"** on their phone. Traitors also see who the other Traitors are.
3. **Round Table:** click **Open Round Table vote**. Players pick who they suspect and confirm. As host you see every vote live. Then click **Close voting**, look at the result and click **Banish ‹name›**. If there's a tie, click **Re-vote between the tied players**.
4. **Night:** click **Start night — murder**. Only the Traitors' phones show the Traitors' Tower, where they choose a victim. You click **Murder ‹name›** to confirm.
   - **Recruit mode:** the Traitors pick a Faithful, and that player gets an offer to join them on their phone.
   - **Shields:** tick 🛡 next to a player in the Players table. That player survives one murder. Shields are used up at breakfast.
5. **Breakfast:** click **Reveal to everyone** to announce who was murdered. Then repeat from step 3.
6. **Endgame:** when only a few players are left, open the **Endgame vote**. Each player votes *End the game* or *Banish again*. The game ends only if everyone votes to end it. The Traitors win if any of them are still in.
   You can also end the game yourself at any time from the Danger zone. That reveals everyone's role.

The admin panel suggests when one side has won, for example when no Traitors are left or the Traitors equal the Faithful.

## Settings (admin panel)

| Setting | What it does |
|---|---|
| **Players see who voted for them** | After a player votes, they see who voted for them. This updates live. |
| Reveal all votes when voting closes | Everyone sees the full tally and who voted for whom. When off, only you see it. |
| Reveal a banished player's role | Tells everyone whether the banished player was a Traitor or Faithful. |
| Players can change their vote | Players can change their vote until voting closes. |
| Traitors know each other | Traitors see who the other Traitors are. |
| Close voting automatically | Closes the vote once everyone has voted. |
| Allow new players to join | Turns off automatically when the game starts. You can still use **Add player**. |
| Vote timer | Sets a countdown for each vote. Voting closes when it reaches zero. |

You can also post an **announcement** that shows on every phone and on the TV.

## If something goes wrong

- **Someone closed their browser or swapped phones:** each player has a **rejoin code** on their screen and in the admin Players table. They enter it under "Already joined on another device?"
- **You clicked the wrong thing:** in the Players table you can change anyone's role or status (alive / banished / murdered), rename them or remove them.
- **The laptop crashed or you pressed Ctrl+C:** run `npm start` again. The game is saved after every action in `data/state.json`, with a backup copy. Everyone carries on where they left off, and phones reconnect by themselves.
- **Fresh start:** click **New game (keep players)** or **Wipe everything** in the admin panel. You can also stop the server and delete the `data/` folder.

## Tests

```bash
npm test
```

- `test/game.test.js` (unit tests): the game rules. They cover role privacy, voting, ties, the vote timer, night, shields, recruitment and the endgame.
- `test/integration.test.js` (integration tests): these start the real server and play full games over HTTP. They also check the admin password, bad input, a restart in the middle of a game, recovery from a corrupt save file, 40 players voting at once and port fallback.
- `test/browser.test.js` (browser test): an admin, four phones and the TV screen click through the real UI in Chromium. This test is skipped unless Playwright is installed. To run it: `npm install --no-save playwright && npx playwright install chromium`.
