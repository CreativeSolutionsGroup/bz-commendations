# Lib Directory

This directory contains the core functions of bz-commendations, including the various services invoked by the API. Below is a brief description of each file in this directory.

## lib/

### revalidate.ts

#### `revalidate`

**Purpose**: Revalidates the given URL using Next ISR

**Parameters**:

- `hostname`: string - The host to revalidate
- `email`: string - The endpoint on `/me` to revalidate

**Returns**: None

---

## lib/api/commendations

### commendations/crud.ts

#### `idToName`

**Purpose**: Returns the name of the student whose id is provided.

**Parameters**:

- `studentId`: string - The id associated with a student

**Returns**: `string` - The name associated with the provided id, or an empty string if the id is not found.

---

#### `emailToId`

**Purpose**: Gets the id of the member whose email was provided.

**Parameters**:

- `sender`: string - An email address of the person you want the id for.

**Returns**: `string | undefined` - The id of the member with the provided email address or undefined if no member is found.

---

#### `createCommendation`

**Purpose**: Creates a record of a commendation.

**Parameters**:

- `sender`: string - The id of the member that sent the commendation
- `recipient`: string - The id of the member who the commendation is being sent to
- `msg`: string - The message that the sender wrote

**Returns**: `Promise<Commendation>`

---

#### `createTeamCommendation`

**Purpose**: Creates a record of a team commendation.

**Parameters**:

- `sender`: string - The id of the member that sent the commendation
- `recipient`: string - The id of the team who the commendation is being sent to
- `msg`: string - The message that the sender wrote

**Returns**: `Promise<TeamCommendation>`

---

#### `readAllCommendations`

**Purpose**: Gets all of the Commendations that have been sent.

**Parameters**: None

**Returns**: `Commendation[]` - A list of all Commendations

---

#### `readAllMembers`

**Purpose**: Gets all of the members except the current user.

**Parameters**:

- `currentUserEmail`: string (optional) - The email address of the current session user

**Returns**: `(Member & { teams: Team[] })[]` - A list of members and their teams

---

#### `readAllMembersFromTeam`

**Purpose**: Gets all members from a specific team.

**Parameters**:

- `teamId`: string - The id of the team

**Returns**: `(Member & { teams: Team[] })[]` - A list of members and their teams, ordered by name ascending

---

#### `updateMemberImageURL`

**Purpose**: Updates the profile picture of a given user.

**Parameters**:

- `image`: string - The url of the profile picture of the user
- `id`: string - The id of the current user

**Returns**: `Promise<Member>`

---

#### `readUserCommendations`

**Purpose**: Gets a list of the commendations sent to the user.

**Parameters**:

- `email`: string - The email address of the current session user

**Returns**: `{ message: string; sender: { name: string; imageURL: string | null; }; }[]` - A list of commendations

---

#### `readTeamCommendations`

**Purpose**: Gets a list of the commendations sent to the team.

**Parameters**:

- `email`: string - The email address of the current session user

**Returns**: `{ message: string; sender: { name: string; imageURL: string | null; }; }[]` - A list of team commendations

---

#### `readUserSentCommendations`

**Purpose**: Gets a list of the commendations sent by the user.

**Parameters**:

- `email`: string - The email address of the current session user

**Returns**: `{ message: string; recipient: { name: string; imageURL: string | null; }; }[]` - A list of commendations

---

#### `readTeamSentCommendations`

**Purpose**: Gets a list of the team commendations sent by the user.

**Parameters**:

- `email`: string - The email address of the current session user

**Returns**: `{ message: string; recipient: { name: string; imageURL: string | null; }; }[]` - A list of team commendations

---

#### `getMemberTeamLeaders`

**Purpose**: Gets all of the team leaders for given teams.

**Parameters**:

- `teams`: string[] - A list of the team ids that you want to get the team leaders for

**Returns**: `Member[]` - A list of the team leaders

---

#### `getMemberWithTeams`

**Purpose**: Gets a Member and all of the Teams that member is on.

**Parameters**:

- `id`: string - The id of a member

**Returns**: `(Member & {teams: Team[];})` - An object containing the member and their teams

---

#### `idIsMember`

**Purpose**: Tests if a given id corresponds to any member.

**Parameters**:

- `id`: string - The id of a member

**Returns**: `boolean` - Indicating the result of the test

---

#### `getMemberImage`

**Purpose**: Gets the profile picture for a given member.

**Parameters**:

- `id`: string - The id of a member

**Returns**: `string | undefined` - A string that represents an image URL

---

#### `removeMember`

**Purpose**: Deletes a member from the database and all their commendations.

**Parameters**:

- `id`: string - The id of the member to be deleted

**Returns**: The deleted member

---

### commendations/email.ts

#### `sendBzEmail`

**Purpose**: Send an email to the recipient(s) with the commendation message.

**Parameters**:

- `senderEmail`: string - The email of the person sending the commendation
- `recipientEmails`: string[] - a list of emails of the people receiving the commendation
- `senderName`: string - name of the person sending the commendation
- `recipientName`: string - name of the person receiving the commendation
- `message`: string - message of the commendation

**Returns**: Response from SES client sender

---

### commendations/text.ts

#### sendBzText

**Purpose**: Send an text to the recipient(s) with the commendation message using the twilio api.

**Parameters**:

- `recipientNumber`: string - The email of the person sending the commendation
- `senderName`: string - name of the person sending the commendation
- `message`: string - message of the commendation

**Returns**: None

---

### commendations/index.ts

- Exports all functions in the commendations directory

## lib/api/db

### db/index.ts

- Exports a prisma client instance

## lib/api/teams

### teams/crud.ts

#### `getTeams`

**Purpose**: Retrieves all teams with their members and associated commendations.

**Parameters**: None

**Returns**: `Promise<Team[]>` - An array of team objects

**Note**: Teams are ordered by name in ascending order. Commendations for each member are ordered by creation date in ascending order.

---

#### `idToEmail`

**Purpose**: Retrieves the email address of a member given their ID.

**Parameters**:

- `memberId`: string - The ID of the member

**Returns**: `Promise<string>` - The email address of the member, or an empty string if not found

---

#### `getTimeRangeCommendations`

**Purpose**: Retrieves commendation data for teams and members within a specified date range.

**Parameters**:

- `dateRange`: object - An object specifying the date range
  - `createdAt`: object
    - `gte`: Date - The start date of the range
    - `lte`: Date - The end date of the range

**Returns**: `Promise<TimeRangeCommendations>` - An object containing:

- `teams`: Array of team objects with aggregated commendation counts
- `members`: Object containing:
  - `sendMembers`: Array of members who sent commendations, ordered by count
  - `recvMembers`: Array of members who received commendations, ordered by count

---

#### `getTeamCommendationsInRange`

**Purpose**: Retrieves detailed commendation information for a specific team within a date range.

**Parameters**:

- `id`: string - The ID of the team
- `firstDate`: Date - The start date of the range
- `secondDate`: Date - The end date of the range

**Returns**: `Promise<object>` - An object containing:

- `sentComms`: Array of commendations sent by team members
- `recvComms`: Array of commendations received by team members

**Note**: Commendations are ordered by creation date in descending order and include details of the sender and recipient.

---

#### `getTeam`

**Purpose**: Retrieves information about a specific team.

**Parameters**:

- `id`: string - The ID of the team

**Returns**: `Promise<Team | null>` - The team object if found, or null if not found

---

### teams/index.ts

- Exports all functions in the teams directory
