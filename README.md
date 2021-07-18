# Dice Boy

A discord bot for runnning Fallout RPG games.

## Usage

To run a command with **Dice Boy**, use the `!vats` command or `@Dice Boy` command. For example, `!vats command` or `@Dice Boy command`.

Use the `!vats help <command>` command to view detailed information about a specific command.
Use `!vats help all` help all to view a list of all commands, not just available ones.

### Rolls: 1. Be Smart 2. Be Safe 3. Don't Screw Up

#### `combat` / `c`

Spread Democracy for Uncle Sam! Uses the Vault-Tec recommended `{dice} {damage type} [{effects,...}] [{hit location}] [{hit location type}]` notation.

```bash
| Description                    | Formula             |
| ------------------------------ | ------------------- |
| 1 Physical                     | 1 ph                |
| 2 Radiation Vicious            | 2 ra vicious        |
| 3 Energy Piercing 2 Stun       | 3 en piercing2,stun |
| 4 Poison Stun Head             | 4 po stun h         |
| 1 Energy Stun Mr. Handy        | 1 en stun handy     |
| 1 Energy Stun Optics Mr. Handy | 1 en stun o handy   |
| ---------------------------------------------------- |
```

#### `roll` / `r`

Try your luck with some dice! Uses [standard dice notation](https://greenimp.github.io/rpg-dice-roller/guide/notation/).

#### `skill` / `s`

Use your skills to help your fellow citizens! Uses the Vault-Tec recommended `{target} [d{dice}][t{tag}][c{complication}] [{difficulty}]` notation.

```bash
| Description                | Formula      |
| -------------------------- | ------------ |
| 10 Target                  | 10           |
| 10 Target, 2 Difficulty    | 10 2         |
| 10 Target, 3 Dice          | 10 d3        |
| 10 Target, 4 Tag           | 10 t4        |
| 10 Target, 19 Complication | 10 c19       |
| A little bit of everything | 10 3dt4c19 2 |
| ----------------------------------------- |
```

### Rules: Knowledge is power, and knowing is half the battle

#### `injury` / `i`

The outside world can never hurt you! Uses the Vault-Tec recommended `{hit location} [{hit location type}]` notation.

```bash
| Description      | Formula |
| ---------------- | ------- |
| Head             | h       |
| Mr. Handy Optics | o handy |
| -------------------------- |
```

### Utility

- `help`: Displays a list of available commands, or detailed information for a specified command.
- `ping`: Checks the bot's ping to the Discord server.
