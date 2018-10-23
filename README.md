# Pixar Giphy Dashboard
  
A simple site that demonstrates integration with the Giphy API.  
  
The game loads 10 buttons of movies produced or created by Pixar.   With a click of each button the program queries Giphy using the button label and pulls back 10 gif links.   The display shows the title, rating and a still image of that gif.   By clicking on the gif image itself,  it will animate.  
  
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
         "git clone https://github.com/five0ffour/Giphyboard.git  
4.  Open index.html in your favorite browser  
        It should display the game board and prompt you for an entry  
  
## Developer notes
index.html:  main entry point and user interface, minimal code is here, the dynamicism is all in the app.js
app.js:  the main mouse click and timer events and UI updates   
  
the Giphy API can be found at:  https://developer.giphy.com  
it requires an email to register a key  
    
No special features are included,  WYSIWYG  
  
## Built With
jQuery 3.3.1 - JavaScript library   
  
## Authors
Michael Galarneau - Initial work - Five0fFour  
  
## Acknowledgements
Giphy API:  https://developer.giphy.com  