

# Dice Boy

A discord bot for running Fallout RPG games.

Tools for GMing a Fallout RPG game can be found [here](https://fallout-gm-tools.vercel.app/) ([git repo](https://github.com/DTCurrie/fallout-gm-tools)).

**NOTE:** Make sure the bot's "Dice Boy" role has permissions to "Manage Messages" and "Use External Emojis" (these should be granted automatically by using the above invite link.)

## Usage

To run a command with **Dice Boy**, use the `!vats` command or `@Dice Boy` command. For example, `!vats command` or `@Dice Boy command`.

Use the `!vats help <command>` command to view detailed information about a specific command.
Use `!vats help all` help all to view a list of all commands, not just available ones.

### Example

Let's walk through a combat scenario to see **Dice Boy** in action.

> As the sun sets over the wasteland, Nate notices a strange silhoutte on the horizon. Nate is being attacked by a Mr. Gutsy that is currently at long range. He knows he is in trouble one-on-one, so he needs to land a devastating blow to the Mr. Gutsy's optics, giving him the advantage in a fire fight. He pulls out his Vicious Piercing Combat Rifle, takes aim, and prepares to take a shot at the advancing robot. The GM warns him he saw a raider encampment not too far back, so a using a loud firearm will be risky.

First, here is a review of the steps for making an attack from the _Fallout Core Rulebook_ as of (July 19th 2021):

> 1. CHOOSE WEAPON AND TARGET: Select one weapon you are currently wielding. Then, select a single character, creature, or object as the target. If you’re using a melee weapon, the target must be visible to you and within your reach. If you’re using a ranged weapon, the target must be visible to you.
>    - Choose Hit Location: You may choose to target a specific part of a target creature or character. This increases the difficulty of the attack by 1.
> 2. ATTEMPT A TEST: The test is determined by the type of weapon used.
>    - Melee Weapon: Roll a **STR + Melee Weapons** test, with a difficulty equal to your target’s Defense.
>    - Ranged Weapon: Roll an **AGI + Small Guns**, END + Big Guns, or **PER + Energy Weapons** test (based on the ranged weapon you’re using), with a difficulty equal to your target’s Defense. This is modified by the range to the target (see Range, p.28)
>    - Thrown Weapon: Roll a **PER + Explosives** or **AGI + Throwing** test, with a difficulty equal to the target’s Defense, modified by range.
>    - Unarmed: Roll a **STR + Unarmed** test, with a difficulty equal to your target’s Defense.
> 3. DETERMINE HIT LOCATION: If you passed your test, roll 1d20 or a hit location die to determine the part of the target you hit. If you choose a specific hit location already, you hit the chosen location instead.
> 4. INFLICT DAMAGE: Roll a number of Combat Dice (CD) listed by the weapon’s damage rating, plus any bonuses from derived statistics, or from AP or ammo spent. Reduce the target’s health points by the total rolled.
>    - Resistances: The target reduces the total damage inflicted by their Damage Resistance against the attack’s damage type, on the location hit. Characters and creatures have different DRs for different types of damage: physical, energy, radiation, and poison.
> 5. REDUCE AMMUNITION: If you made a ranged attack, remove one shot of ammunition, plus any additional shots of ammunition spent on the attack. If you made a thrown weapon attack, remove the thrown weapon from your inventory.

For step 1, Nate is choosing his Vicious Piercing Combat Rifle and targeting the Mr. Gutsy's optics specifically. This will increase the difficulty of the roll by 1.

For step 2, Nate needs to make an **AGI + Small Guns** check to make a shot with his rifle. Let's determine the parameters for this skill check:

- Nate has an **AGI** of 8 and a **Small Guns** of 4, so his **target** will be **12**
- The Mr. Gutsy has a **Defense** of 1. Nate is targeting a specific hit location, so that will add 1 to the difficulty. Nate is also firing a **Medium** range weapon at **Long** range, so that will add an additional 1 to the difficulty.
  - This means the roll's **difficulty** will be **3**.
- Nate has **Small Guns** tagged, meaning the roll will have a **tag** of **4**.
- Nate has been pooling his Action Points and is willing to spend an Action Point to increase the **dice** for the roll to **3**
- The GM ruled the roll is risky, meaning it's **complication** threshold will be **19**

Now that we know what the parameters are, let's make a skill check using the `!vats s {target} [d{dice}][t{tag}][c{complication}] [{difficulty}]` notation. With the values above, that skill roll command would look like:

`!vats s 12 d3t4c19 3`

And gets a result of:

![Nate's Skill Check Example Result: Success!](/docs/images/nate-skill-check-example-result.png)

With 3 successes Nate is going to succesfully hit the Mr. Gutsy. Nate chose a hit location, so we will skip Step 3 (for now, the combat roll will automatically determine location if none is provided) and go straight to Step 4.

We need to determine the parameters for Nate's combat check:

- He is using a Combat Rifle, so he will be rolling **5** combat **dice**
- The Combat Rifle does physical damage, so he will be using a **damage type** of **phys**
- The Combat Rifle has two effects: `Vicious` and `Piercing 1`, so his **effects** will be **vicious,piercing1**
- He chose to target the Mr. Gutsy's optics, so he will enter a **hit location** of **o**
  - Note: If Nate had not chosen a **hit location**, he would simply not enter one and **Dice Boy** would automatically determine it for him.
- The Mr. Gutsy uses a unique **Hit Locations Table**, so the roll will use a **hit location type** of **handy**

With all the combat parameters determined, it is time to do some damage! The combat roll command would look like:

`!vats c 5 phys vicious,piercing1 optics handy`

And gets a result of:

![Nate's Skill Check Example Result: 3 Damage!](/docs/images/nate-combat-check-example-result.png)

What a hit! Let's break down the results and see what the resolution is.

Nate did 3 Physical damage, plus 2 additional damage from the Vicious effect for a total of **5 Physical damage**. The Mr. Gutsy has **PHYS. DR** of **2 (All)**, meaning normally he would ignore 2 of Nate's Damage; however, the Piercing 1 effect means Nate's attack negates the Mr. Gutsy's DR entirely.

So after the DR reductions and damage calculation, Nate ends up dealing **5 Physical damage** to the Mr. Gutsy's optics. That means Nate scored a **critical hit**, and the Mr. Gutsy will suffer an injury.

To find out what the critical injury is for a Mr. Gutsy's optics is, you can use the `injury` command to check the rule. That command would look like:

`!vats inj optics handy`

Which would result in:

![Nate's Injury Rule Example Result: Head!](/docs/images/nate-injury-rule-example-result.png)

With that, Nate will get another chance to deal some damage before the Mr. Gutsy even has a chance to respond. And even when it does, it will take a +2 difficulty penalty to any returning fire. Nate's gamble paid off, and he will survive to scavenge the wasteland for another day.

### Rolls: 1. Be Smart 2. Be Safe 3. Don't Screw Up

Use the various roll commands to automate checks in Fallout RPG.

#### `combat` / `c`

Spread Democracy for Uncle Sam! Uses the Vault-Tec recommended `!vats c {dice} [{damage type}] [{effects,...}] [{hit location}] [{hit location type}]` notation.

Here is breakdown of the notation parameters:

- Dice _(required)_: How many combat dice (CD) to roll.
- Damage Type (optional): The Damage Type being inflicted.
- Effects (optional): A comma delimited list of effects for the weapon
- Hit Location (optional): The hit location to aim for, if not provided it will be determined automatically
- Hit Location Type (optional): The **Hit Locations Table** to use. If not provide it will use the `default` table.

The `combat` command will automate your damange rolls. This includes calculating damage, damage effects, and hit locations based on the provided options.

| Description                    | Formula                              |
| ------------------------------ | ------------------------------------ |
| 1                              | `!vats c 1`                          |
| 1 Physical                     | `!vats c 1 phys`                     |
| 2 Radiation Vicious            | `!vats c 2 rads vicious`             |
| 3 Energy Piercing 2 Stun       | `!vats c 3 energy piercing2,stun`    |
| 4 Poison Stun Head             | `!vats c 4 poison stun head`         |
| 1 Energy Stun Mr. Handy        | `!vats c 1 energy stun handy`        |
| 1 Energy Stun Optics Mr. Handy | `!vats c 1 energy stun optics handy` |

##### Damage Type Keys

Use the following damage type keys for your combat rolls:

| Damage Type | Key      |
| ----------- | -------- |
| Physical    | `phys`   |
| Energy      | `energy` |
| Radiation   | `rads`   |
| Poison      | `poison` |

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

| Damage Effect | Keyword     |
| ------------- | ----------- |
| Head          | `head`      |
| Torso         | `torso`     |
| Left Arm      | `left-arm`  |
| Right Arm     | `right-arm` |
| Left Leg      | `left-leg`  |
| Right Leg     | `right-leg` |

###### Mr. Handy Hit Locations

| Damage Effect | Keyword     |
| ------------- | ----------- |
| Optics        | `optics`    |
| Main Body     | `main-body` |
| Arm One       | `arm-1`     |
| Arm Two       | `arm-2`     |
| Arm Three     | `arm-3`     |
| Thruster      | `thruster`  |

#### `roll` / `r`

Try your luck with some dice! Uses the Vault-tec recommended `!vats r {formula}` [dice notation](https://greenimp.github.io/rpg-dice-roller/guide/notation/).

The `roll` command is just a dice roller following standard dice notation. There is no further logic included in the command.

For example, to simple roll 1 20-sided die:

`!vats r 1d20`

#### `skill` / `s`

Use your skills to help your fellow citizens! Uses the Vault-Tec recommended `!vats s {target} [d{dice}][t{tag}][c{complication}] [{difficulty}]` notation.

The `skill` command will automate skill checks, including calculating success, action points earned, and complications based on the provided options.

Here is breakdown of the notation parameters:

- Target _(required)_: The Attribute + Skill target threshold for the skill check.
- Dice (optional): The amount of dice to roll, will default to 2.
- Tag (optional): If using a tagged skill, its rating. Will default to 1.
- Complication (optional): If the GM has determined the check has additional complications, enter the rating. Will default to 20.
- Difficulty (optional): The difficulty for the check. Will default to 0.

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

The outside world can never hurt you! Uses the Vault-Tec recommended `!vats inj [{hit location}] [{hit location type}]` notation.

Here is breakdown of the notation parameters:

- Hit Location (optional): The hit location that received a critical hit (in [kebab-case](https://en.wiktionary.org/wiki/kebab_case)
- Hit Location Type (optional): The **Hit Locations Table** to use. If not provide it will use the `default` table.

If no parameters are passed, a list of all injuries will be printed.

| Description      | Formula                  |
| ---------------- | ------------------------ |
| List of Injuries | `list` (default)         |
| Head             | `!vats inj head`         |
| Mr. Handy Optics | `!vats inj optics handy` |

#### `quality` / `qual`

The outside world can never hurt you! Uses the Vault-Tec recommended `!vats {quality}` notation.

Here is breakdown of the notation parameters:

- Quality _(required)_: The weapon quality you want to check the rules for (in [kebab-case](https://en.wiktionary.org/wiki/kebab_case))

If no quality is passed, a list of all weapon qualities will be printed.

| Description       | Formula                   |
| ----------------- | ------------------------- |
| List of Qualities | `list` (default)          |
| Accurate          | `!vats qual accurate`     |
| Night Vision      | `!vats qual night-vision` |
| Two-Handed        | `!vats qual two-handed`   |

### Utility

- `help`: Displays a list of available commands, or detailed information for a specified command.
- `ping`: Checks the bot's ping to the Discord server.
