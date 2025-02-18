let text = "";
// check the size of the box
getSquare();


// ADD TEXT TO BOX
// Whatever is entered in the text box in the sidebar, add it to the main view
function userinput() {
  
  // whatever the user enters into the box
  text = document.getElementById("userInput").value;
  
  // change backticks and double quotes into single quotes
  let textRegex = /[`"]/g;
  text = text.replace(textRegex, "'");
  
  // strip out any characters that might render content as HTML
  let specialRegex = /[<{>}]/g;
  text = text.replace(specialRegex, "");
  
  document.getElementById("text").innerHTML = text;
  sortText();
}


// FORMAT TEXT
function sortText() {
  let textArray = text.split(" ");
  let textPrint = textArray.join("</span> <span class='word'>")

  // PRINT CONTENTS OF TEXT TO PAGE
  document.getElementById("text").innerHTML = "<span class='word'>" + textPrint;

  // HIGHLIGHT A WORD ON CLICK
  // get all elements with the CSS class '.word' and put them in a variable
  let word = document.getElementsByClassName("word");

  // function to toggle the class '.poemWord'
  function selectWord() {
    this.classList.toggle('poemword');
  };

  // When an element with the CSS class '.word' is clicked, run the function to toggle the class
  for (var i=0; i < word.length; i++) {
    word[i].addEventListener('click', selectWord, false);
  }

  // MAKE THE MAGIC HAPPEN AND COMMIT IT TO THE PAGE
  document.getElementById("commit").addEventListener('click', blackout, false);

  // For each word that has been selected, add the class '.committed' to make a note of it, then add the class '.blackout' to all the others.
  function blackout() {
    for (var i=0; i < word.length; i++) {
  
      if (word[i].classList.contains("poemword")) {
        word[i].classList.remove("poemword");
        word[i].classList.add("committed");
      } else {
        word[i].classList.add("blackout");
      }
  }
  
  // add a CSS class to containers to make absolutely sure the background is black
  document.getElementById("text").classList.add("blackground");
  document.getElementById("container").classList.add("blackground");
  document.getElementById("picframe").classList.add("blackground");
  
  // remove the button that deselects words
  document.getElementById("reset").removeEventListener('click', clearselection, false);
  // and add one that resets the entire text instead
  document.getElementById("reset").addEventListener('click', clearall, false);

  // Add the buttons to convert to image
  document.getElementById("image").innerHTML = "<p>If you're happy, click the button below to turn your text into an image.</p><button id='renderImage'>Render square</button><button id='renderFullImage'>Render full text</button><div id='previewImage'></div><div id='downloadImage'></div>";
  
  document.getElementById("renderImage").addEventListener('click', function(){snapshot("picframe")}, false);
  document.getElementById("renderFullImage").addEventListener('click', function(){snapshot("text")}, false);
  
}
  
  
function snapshot(element) {
    html2canvas(document.getElementById(element)).then(function(canvas) {
    let getFullCanvas = canvas;
      
      // generate an image element
      var imageData = document.createElement('img');
      
      // get the data from the canvas and apply it to the image
      imageData.src = getFullCanvas.toDataURL("image/png");
      
      // now append the image to the previewImage div
      document.getElementById("previewImage").appendChild(imageData);
    }); 
  }


// CLEAR SELECTIONS
document.getElementById("reset").addEventListener('click', clearselection, false);

// if a word contains the class '.poemword' (which selects it) remove it
function clearselection() {
  for (var i=0; i < word.length; i++) {
    if (word[i].classList.contains('poemword')) {
      word[i].classList.remove("poemword");
    }
  }
}


// RESET BUTTON
function clearall() {
  for (var i=0; i < word.length; i++) {
  // remove the selected words
    if (word[i].classList.contains('committed')) {
      word[i].classList.remove('committed');
    // remove the blackout effect
    } else if (word[i].classList.contains('blackout')) {
      word[i].classList.remove("blackout");
    }
  }
    // remove the black background from the container boxes
    document.getElementById("text").classList.remove("blackground");
    document.getElementById("container").classList.remove("blackground");
    document.getElementById("picframe").classList.remove("blackground");
    // return the image container to its original state
    document.getElementById("image").innerHTML = "<p class='info'>Your image will appear here when you're done.</p>";
    // turn the reset button back into a button which just clears the selected words
    document.getElementById("reset").removeEventListener('click', clearall, false);
    document.getElementById("reset").addEventListener('click', clearselection, false);
  }
}

// COLLAPSIBLE PANELS
// coll is the collapsible panels for info and typeface, collmob is the mobile menu
var coll = document.getElementsByClassName("collapsible");
var collmob = document.getElementsByClassName("collapsiblemobile");

function collapse(panel) {
  for (var i = 0; i < panel.length; i++) {
    // when a collapsible element is clicked...
    panel[i].addEventListener("click", function() {
      // ...add the CSS class 'active' to it
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      } 
    });
  }
}

// call the above functions for both types of collapsible panel 
collapse(coll);
collapse(collmob);


// TEXT APPEARANCE
// when one of the typeface names is clicked change the font to that typeface
function fontFamily(typeface) {
  document.getElementById("text").style.fontFamily = typeface;
}

// when you click one of the typeface names it runs the above function
document.getElementById("special").addEventListener('click', function() {
  fontFamily("Special Elite");
});

document.getElementById("baskerville").addEventListener('click', function() {
  fontFamily("Libre Baskerville");
});

document.getElementById("lato").addEventListener('click', function() {
  fontFamily("Lato");
});

document.getElementById("times").addEventListener('click', function() {
  fontFamily("Times");
});

document.getElementById("monospace").addEventListener('click', function() {
  fontFamily("monospace");
});

// FONT SIZE
let words = document.getElementById('text');

// make text smaller when minus button clicked
document.getElementById("smaller").addEventListener('click', function() {
  let style = window.getComputedStyle(words , null).getPropertyValue('font-size');
  let fontSize = parseFloat(style); 
  words.style.fontSize = (fontSize - 2) + 'px';
});

// make text bigger when plus button clicked
document.getElementById("bigger").addEventListener('click', function() {
  let style = window.getComputedStyle(words , null).getPropertyValue('font-size');
  let fontSize = parseFloat(style); 
  words.style.fontSize = (fontSize + 2) + 'px';
});

// Make the boxes always be perfectly square based on percentage
// function getSquare() {
//   let border = document.getElementById('border').offsetWidth;
//   let wrapper = document.getElementById('wrapper').offsetWidth;
//   let container = document.getElementById('container').offsetWidth;
//   document.getElementById('border').style.height = wrapper + "px";
//   document.getElementById('wrapper').style.height = wrapper + "px";
//   document.getElementById('picframe').style.height = container + "px";
//   document.getElementById('container').style.height = container + "px";
// }

function getSquare() {
  // Assuming each class has only one element, but you can loop through them if there are multiple
  let borders = document.getElementsByClassName('border');
  let wrappers = document.getElementsByClassName('wrapper');
  let containers = document.getElementsByClassName('container');
  let picframes = document.getElementsByClassName('picframe');

  if (wrappers.length > 0 && borders.length > 0) {
    let wrapperWidth = wrappers[0].offsetWidth;
    for (let border of borders) {
      border.style.height = wrapperWidth + "px";
    }
    for (let wrapper of wrappers) {
      wrapper.style.height = wrapperWidth + "px";
    }
  }

  if (containers.length > 0 && picframes.length > 0) {
    let containerWidth = containers[0].offsetWidth;
    for (let container of containers) {
      container.style.height = containerWidth + "px";
    }
    for (let picframe of picframes) {
      picframe.style.height = containerWidth + "px";
    }
  }
}

// run the above function every time the window is resized
window.addEventListener('resize', function(event){
  getSquare();
});

