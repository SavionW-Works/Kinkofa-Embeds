//Global Variables
let currentKey;
let formTable = {};

function readForm() {
  formTable = {};
  var form = document.getElementById("searchQuery");
  var inputs = form.getElementsByTagName("input");

  //Puts form inputs into a object with labels as keys, and inputs as values
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (input.type !== "button") {
      // Ignore the button input text
      var id = input.id;
      var value = input.value;
      formTable[id] = value.trim().toLowerCase(); //Clean input from form
    }
  }

  console.log(formTable); //Debug
  currentKey = formToKey(); //Retrieve the key for the cemetery respective to the page
  filterCemeteriesByKey();
}

function formToKey() {
  newKey = "";
  //Append each object value to a string resembling keys
  for (let value of Object.values(formTable)) {
    newKey += `${value}`;

    //If the current parameter is filled, add an underscore. This helps prevent problematic keys with extraneous underscores (i.e: "texas__")
    if (value) {
      newKey += "_";
    }
  }

  //newKey = removeCharacterAtIndex(newKey, newKey.length - 1); //take off last underscore "_"
  newKey = newKey.slice(0, newKey.length - 1); //take off last character since its an underscore "_"

  console.log("key from form: ", newKey); //Debug

  return newKey;
}

//Filtering Code from Savion

// Function to get the current cemetery's key
//Key format: class in the name "[State]_[County]_[City]" (All lowercase)
function getCurrentKey() {
  const currentCemeteryElement = document.getElementById("current-key");
  if (currentCemeteryElement) {
    const key = currentCemeteryElement.className.trim().toLowerCase();
    console.log("Current Cemetery Key:", key);
    return key;
  } else {
    console.error("Current cemetery key not found");
    return null;
  }
}

function matchKeys(baseKey, testKey) {
  /**Allows approximate matches with specific keys to also appear in the search
   * Ex: a baseKey of "texas_gonzales_" will show matches for "texas_gonzales_" and "texas_gonzales_harwood"
   * The more specific a key is, the more specific the search
   * Exact matches with incomplete keys are no longer made.
   */

  // Escape any special characters in the baseKey for regex
  var escapedPattern = baseKey.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

  // Create a regex pattern that matches the baseKey followed by optional word characters and dashes
  var regex = new RegExp("^" + escapedPattern + "[\\w\\s_]*$");

  console.log(regex.test(testKey));

  // Test the testString against the regex
  return regex.test(testKey);
}

/**Only shows cemeteries as close to key as possible
  Filters from State, then County, then City
  If one part of the key was missing, filtering will NOT display the cemetery
  Remember: State contains County, which contains City. Keys with just "_County_City" or "State__City" wouldn't reasonably exist.
  Being strict also accounts for States whose names equal cities  **/

function filterCemeteriesByKey() {
  console.log("Filtering cemeteries by key");
  if (!currentKey) {
    console.error("Current key not found, cannot filter");
    return;
  }
  const cemeteries = document.querySelectorAll(".cemetery-item");
  console.log("Total cemeteries found:", cemeteries.length);

  cemeteries.forEach((cemetery) => {
    let cemeteryKey;
    // Select all div elements within the parent element
    let allDivs = cemetery.querySelectorAll("div");

    let keyDivs = Array.from(allDivs).filter((div) => {
      return Array.from(div.classList).some((className) =>
        className.startsWith("key-")
      );
    });

    // Filter the div to get only those whose class name starts with "key-"
    //CMS collection list items have "key-" in their class names in order to collect all keys, AND not make unique id values with keys.
    cemeteryKey = keyDivs[0].className.trim().toLowerCase().slice(4);

    //console.log("currentKey = ", currentKey);
    //console.log("cemeteryKey = ", cemeteryKey);

    //parent of parentElement Needed for New Cemetery Listing. Cemetery Listing only needed cemetery element
    if (matchKeys(currentKey, cemeteryKey) == false) {
      //console.log("Hiding cemetery with key:", cemeteryKey);

      cemetery.parentElement.parentElement.style.display = "none"; //Hide element from DOM so additional  searches can be used
    } else {
      //console.log("Showing cemetery with key:", cemeteryKey);
      cemetery.parentElement.parentElement.style.display = "block"; //cemtery is shown
    }
  }); //end of cemetery loop
}

//*MAIN*//