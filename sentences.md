# How to work with sentence place holders

## Guid

1. Go into sentences.json
2. Edit a sentence you want to change
3. All place holders starts and ends with "$" ( e.g. $username$ )

## Which are available

Normal: 
username => The user how used the command
pointsname => You points name ( e.g. coin )
points => Current amount of points of the user who used that command
displayname => The user how used the command

Only available in song commands:
songusername => The user who wanted that song
songid => The id of this song
songtitle => The name of this song
songlist => Get's the whole list of all songs in list
nextsongtitle => Get's the next song's name
nextsongusername => Get's the next song's username

Only available in raffle commands:
time => How many seconds are left
winusername => The winning user of the raffle
winuserdisplay => The winning user of the raffle
winpoints => How many points he got

Only availabel in right commands:
targetusername => The written username
rightname => The written right
rightnames => All rights of target user