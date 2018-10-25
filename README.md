# Pixar Giphy Dashboard
  
A simple site that demonstrates integration with the Giphy API.  
  
The game loads 10 buttons of movies produced or created by Pixar.   With a click of each button the program queries Giphy using the button label and pulls back 10 gif links by default.   The display shows the title, rating and a still image of each gif.   By clicking on the gif image itself,  it will animate.  Click again and it pauses.
  
The sidebar filter box allows the user to to add a new topic button,  customize the number of gifs returned and/or filter the rating level capping it to the specified rating.
  
The application runs a parallel query to do a movie search and display an associated movie poster (if found).  If an entry is found the program displays some contextual content (name, year, plot, rating) and the img of the moview poster on the sidebar.  
  
Finally there is a rudimentary favorites feature.  Each giphy image has a heart button floating in the upper right corner.  If selected it will park of copy of that image into the favorites pane.  As with the gif pane,  it will display a still version of the gif until it is clicked, at which point it will animate.  Click again to still the image.
  
## Getting Started
To get started,  copy the program to a clean directory and run "index.html" in your browser.   The program is ready to start automatically.  From there click on a button, image or use the "add gif" button to add a movie query of your own.  
  
## Prerequisites
A modern browser and an internet connection.   Chrome works best, but others should be fine too.  
A modern IDE - it was developed using Visual Studio Code, but any text editor would work, including notepad.  
GitHub  
GitBash installed locally  
  
## Installing
1.  Find a Locate an empty directory on your hard drive  
2.  Open a bash terminal in that directory  
3.  Clone the unit-4-game repo down using  Git    
         "git clone https://github.com/five0ffour/Pixar.git  
4.  Open index.html in your favorite browser  
        It should display the game board and prompt you for an entry  
  
## Developer notes
index.html:  main entry point and user interface, minimal code is here, the dynamicism is all in the app.js
app.js:  the main mouse click and timer events and UI updates     
  
the Giphy API can be found at:  https://developer.giphy.com  
the OMDB API can be found at: http://www.omdbapi.com/    
both APIs require an email to get a registered key  

Final note:  The query is built around pixar movies.  To promote relevant pixar movie responses in the giphy search,  we add a "pixar" tag to every search to boost up pixar related content.  (e.g., consider what "cars", "coco" or "up" would return otherwise)  

## Built With
jQuery 3.3.1 - JavaScript library   
Bootstrap 4.1.2 - Bootstrap Library  
Font Awesome 5.4.1 - Font Library  
  
## Authors
Michael Galarneau - Initial work - Five0fFour  
  
## Acknowledgements
Pixar (of course!):  http://www.pixar.com
Giphy API:  https://developer.giphy.com
OMDB API:  http://www.omdbapi.com/  
Background Wallpaper: http://pixar.wikia.com/wiki/Pixar_Animation_Studios  (modified)  
Favicon:  https://www.iconfinder.com/icons/23178/eve_pixar_robot_icon  