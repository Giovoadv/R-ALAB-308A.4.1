import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_YsSFSegfe4G7ubhLMGABG40di3GsPR9Mv9a9E517ROPIIS7QgVltFbcE2K9UDRYH";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

axios
  .get(`https://api.thecatapi.com/v1/breeds`)
  .then((res) => {
    for (const breeds of res.data) {
      initialLoad(breeds);
    }
  })
  .catch((err) => {
    console.log(err);
  });

const initialLoad = async (breeds) => {
  const breedsName = breeds.name;
  const breedsId = breeds.id;

  const breedList = document.createElement("option");
  breedList.setAttribute("value", `${breedsId}`);
  breedList.textContent = `${breedsName}`;

  breedSelect.appendChild(breedList);
};

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
const handleBreedSelect = async (e) => {
  e.stopImmediatePropagation();
  const breedId = breedSelect.value;
  console.log(breedSelect.value);

  axios
    .get(
      `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${API_KEY}`,
      {
        onDownloadProgress: (progressEvent) => {
          updateProgress(progressEvent);
        },
      }
    )
    .then((res) => {
      console.log(res.data);
      for (const breedInfo of res.data) {
        // console.log(res.data);
        console.log(breedInfo);
        const catsImg = breedInfo.url;
        const catsId = breedInfo.id;
        const carouselItem = Carousel.createCarouselItem(
          catsImg,
          "cat",
          catsId
        );
        Carousel.appendCarousel(carouselItem);
        Carousel.start();
      }
      if (res.data.length <= 0) {
        const breedEmpty = document.createElement("div");
        breedEmpty.innerHTML = `<h1> No Data available at this time </h1>
        `;

        infoDump.appendChild(breedEmpty);
      } else {
        const infoDump = document.getElementById("infoDump");
        const breedInfo = document.createElement("div");
        breedInfo.setAttribute("class", "breed-info");
        breedInfo.innerHTML = `
          <h2>${res.data[0].breeds[0].name}</h2>
          <p>Origin: ${res.data[0].breeds[0].origin}</p>
          <p>${res.data[0].breeds[0].description}</p>
          <p>Life Span: ${res.data[0].breeds[0].life_span}</p>
    
          <h3>Temperament</h3>
          <p>${res.data[0].breeds[0].temperament}</p>`;

        infoDump.appendChild(breedInfo);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  Carousel.clear();
  updateInfo();
};

const updateInfo = () => {
  const infoDump = document.getElementById("infoDump");
  while (infoDump.firstChild) {
    infoDump.removeChild(infoDump.firstChild);
  }
};

breedSelect.addEventListener("change", handleBreedSelect, false);

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

axios.interceptors.request.use(
  function (config) {
    const date = new Date().toLocaleString();
    const progressBarEl = document.querySelector("#progressBar");
    progressBarEl.style.width = "0%";
    document.body.style.cursor = "progress";

    const percentCompleted = Math.floor((config.loaded / config.total) * 100);

    console.log(" Request made at", date);
    return config;
  },
  function (error) {
    console.log(error);
    return error;
  }
);

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    const date = new Date().toLocaleString();
    document.body.style.cursor = "default";
    console.log("Response Time at", date);

    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

const updateProgress = (progressEvent) => {
  console.log("progress event ", progressEvent);
  const progressBarEl = document.querySelector("#progressBar");
  progressBarEl.style.width = `${Math.floor(
    (progressEvent.loaded / progressEvent.total) * 100
  )}%`;
};

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  try {
    const favourite = document.querySelector(`#button_${imgId}`);
    if (favourite.classList.contains("favourite-button-active")) {
      const res = await axios.get(
        `https://api.thecatapi.com/v1/favourites/?image_id=${imgId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      if (res.data.length > 0) {
        const favoriteId = res.data[0].id;
        await axios.delete(
          `https://api.thecatapi.com/v1/favourites/${favoriteId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
            },
          }
        );
      }
      console.log(res.data[0].id);

      console.log("Unfavourited");

      favourite.classList.remove("favourite-button-active");
    } else {
      const res = await axios.post(
        `https://api.thecatapi.com/v1/favourites`,
        { image_id: imgId },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      if (res.status === 200) {
        favourite.classList.add("favourite-button-active");
        console.log("Favourited", res);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

const getFavourites = async () => {
  try {
    const res = await axios.get(`https://api.thecatapi.com/v1/favourites`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
    });

    Carousel.clear();
    updateInfo();

    for (const fav of res.data) {
      const carouselItem = Carousel.createCarouselItem(
        fav.image.url,
        "cat",
        fav.image.id
      );
      Carousel.appendCarousel(carouselItem);
      Carousel.start();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

getFavouritesBtn.addEventListener("click", getFavourites);

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
