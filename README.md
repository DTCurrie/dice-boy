# Dice Boy

A discord bot for runnning Fallout RPG games: [Discord Invite](https://discord.com/oauth2/authorize?client_id=835523028918075403&scope=bot&permissions=8192)

## Usage

To run a command with **Dice Boy**, use the `!vats` command or `@Dice Boy` command. For example, `!vats command` or `@Dice Boy command`.

Use the `!vats help <command>` command to view detailed information about a specific command.
Use `!vats help all` help all to view a list of all commands, not just available ones.

### Rolls: 1. Be Smart 2. Be Safe 3. Don't Screw Up

Use the various roll commands to automate checks in Fallout RPG.

#### `combat` / `c`

Spread Democracy for Uncle Sam! Uses the Vault-Tec recommended `!vats c {dice} {damage type} [{effects,...}] [{hit location}] [{hit location type}]` notation.

The `combat` command will automate your damange rolls. This includes calculating damage, damage effects, and hit locations based on the provided options.

| Description                    | Formula                       |
| ------------------------------ | ----------------------------- |
| 1 Physical                     | `!vats c 1 ph`                |
| 2 Radiation Vicious            | `!vats c 2 ra vicious`        |
| 3 Energy Piercing 2 Stun       | `!vats c 3 en piercing2,stun` |
| 4 Poison Stun Head             | `!vats c 4 po stun h`         |
| 1 Energy Stun Mr. Handy        | `!vats c 1 en stun handy`     |
| 1 Energy Stun Optics Mr. Handy | `!vats c 1 en stun o handy`   |

##### Damage Type Keys

Use the following damage type keys for your combat rolls:

| Damage Type | Key  |
| ----------- | ---- |
| Physical    | `ph` |
| Energy      | `en` |
| Radiation   | `ra` |
| Poison      | `po` |

##### Damage Effect Keywords

Use the following keys for your damage effects:

| Damage Effect | Keyword                                          |
| ------------- | ------------------------------------------------ |
| Burst         | `burst`                                          |
| Breaking      | `breaking`                                       |
| Persistent    | `persistent`                                     |
| Piercing X    | `piercingX` (replace X with the piercing rating) |
| Radioactive   | `radioactive`                                    |
| Spread        | `spread`                                         |
| Stun          | `stun`                                           |
| Vicious       | `vicious`,                                       |

##### Hit Locations

Use the following hit locations for attacks. **Dice Boy** will use the `default` type unless a type key is specified.

###### Types

| Damage Effect | Key       |
| ------------- | --------- |
| Default       | `default` |
| Mr.Handy      | `handy`   |

###### Default Hit Locations

| Damage Effect | Keyword |
| ------------- | ------- |
| Head          | `h`     |
| Torso         | `t`     |
| Left Arm      | `la`    |
| Right Arm     | `ra`    |
| Left Leg      | `ll`    |
| Right Leg     | `rl`    |

###### Mr. Handy Hit Locations

| Damage Effect | Keyword |
| ------------- | ------- |
| Optics        | `o`     |
| MainBody      | `mb`    |
| Arm One       | `a1`    |
| Arm Two       | `a2`    |
| Arm Three     | `a3`    |
| Thruster      | `t`     |

#### `roll` / `r`

Try your luck with some dice! Uses the Vault-tec recommended `!vats r {formula}` [dice notation](https://greenimp.github.io/rpg-dice-roller/guide/notation/).

The `roll` command is just a dice roller following standard dice notation. There is no further logic included in the command.

#### `skill` / `s`

Use your skills to help your fellow citizens! Uses the Vault-Tec recommended `!vats s {target} [d{dice}][t{tag}][c{complication}] [{difficulty}]` notation.

The `skill` command will automate skill checks, including calculating success, action points earned, and complications based on the provided options.

| Description                | Formula                |
| -------------------------- | ---------------------- |
| 10 Target                  | `!vats s 10`           |
| 10 Target, 2 Difficulty    | `!vats s 10 2`         |
| 10 Target, 3 Dice          | `!vats s 10 d3`        |
| 10 Target, 4 Tag           | `!vats s 10 t4`        |
| 10 Target, 19 Complication | `!vats s 10 c19`       |
| A little bit of everything | `!vats s 10 3dt4c19 2` |

### Rules: Knowledge is power, and knowing is half the battle

The rules commands to get a quick reference to a particular rule. These will often use key(words) from the rolls commands.

#### `injury` / `inj`

The outside world can never hurt you! Uses the Vault-Tec recommended `!vats inj {hit location} [{hit location type}]` notation.

| Description      | Formula             |
| ---------------- | ------------------- |
| Head             | `!vats inj h`       |
| Mr. Handy Optics | `!vats inj o handy` |

### Utility

- `help`: Displays a list of available commands, or detailed information for a specified command.
- `ping`: Checks the bot's ping to the Discord server.
