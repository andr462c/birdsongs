# Plan
This project should contain a typescript+html implementation of a bird quiz/identification game.

The initial project be a guessing game based on bird songs/calls/sounds.
The birds should be a predefined list of european bird.
The birds should be located in denmark.

The flow should be like:

1: Show a page with a play button.
The play button, should play a bird sound of a preselected bird

2: Based on the song, the player should guess the bird by writing the name.
The box with the name should provide auto complete (from a list of available birds), to make it easier.
After a bird has been guessed return to (1)

# data
The bird list and songs should be fetched from "https://xeno-canto.org/explore/api". This page shows the
documentation for the api call. Additional the page "https://xeno-canto.org/help/search" shows the query format.

I have found the following usefull tags (more useful tags may be available):
grp:birds
gen:zonotrichia // This could be to make setting where you can chose the species of birds to guess
Geographic coordinates // Can be used to limit recordings to around denmark
q:A // Only use good quality
area:europe

To get a list of bird one could search wiki "https://en.wikipedia.org/wiki/List_of_birds_of_Europe"

