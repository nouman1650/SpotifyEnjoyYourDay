console.log("welcome to JS");

// To store folders dynamically
let folders = [];

// Convert the time
function formatTime(seconds) {
  seconds = Math.floor(seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

let songs = []; // Array to store songs
let currentSong = new Audio(); // Current song object

// Fetch song list from a specific folder
let getSongs = async (folder) => {
  songs = []; // Clear previous songs
  try {
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".m4a")) {
        songs.push(element.href); // Add songs to the list
      }
    }

    displaySongs(); // Update the playlist display
    playMusic(songs[0], true); // Play the first song in the folder
    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
};

// Function to play a song
const playMusic = (track, pause = false) => {
  if (!track.startsWith("http") && !track.startsWith("/songs/")) {
    track = "/songs/" + track; // Prepend "/songs/" for filenames
  }
  currentSong.src = track;

  currentSong.addEventListener("loadedmetadata", () => {
    const totalDuration = formatTime(currentSong.duration);
    document.querySelector(".songtime").innerHTML = `00:00 / ${totalDuration}`;
  });
 
  if (!pause) {
    currentSong.play();
    document.getElementById("play").src = "images/pause.svg";
  } else {
    document.getElementById("play").src = "images/play.svg"; // Update to "play" icon when paused
  }

  let NameofSong = track.split("/").pop();
  document.querySelector(".songinfo").innerHTML = decodeURI(NameofSong);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Display songs in the playlist
const displaySongs = () => {
  let SongsUL = document.querySelector(".songlists ul");
  SongsUL.innerHTML = ""; // Clear previous songs
  for (const song of songs) {
    let songName = song.split("/").pop();
    SongsUL.innerHTML += `
      <li>
        <img class="invert" src="images/music.svg" alt="">
        <div class="info">
            <div class="songname size">${songName}</div>
        </div>
        <div class="playNow flex">
            <span> play now</span>
            <img class="invert" src="images/play.svg" alt="">
        </div>
      </li>`;
  }

  // Attach event listeners to each song
  Array.from(document.querySelectorAll(".songlists li")).forEach((e, index) => {
    e.addEventListener("click", () => {
      playMusic(songs[index]);
    });
  });
};




let CardContainer = document.querySelector(".cardcontainer");
let DisplayAlbums = async ()=>{
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div  =document.createElement("div");
  div.innerHTML  = response;
  let links = div.getElementsByTagName("a");

 let array =   Array.from(links);
 for (let index = 0; index < array.length; index++) {
  const e = array[index];

    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-2)[1];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();

      CardContainer.innerHTML = CardContainer.innerHTML + 
      `<div data-folder="${folder}" class="card roboto-light">
                <div class="play">
                  <img src="images/play-button.svg" class="playbutton" alt="">
                </div>
                <div class = "SongPic"><img src="/songs/${folder}/Cover.jpeg" alt="" class="innersongPic"> </div>
                <div>
                <h2>${response.title}</h2>
                <p>${response.description}</p>
                </div>

                
      </div>`
       
    }
  }
  
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async () => {
      let folder = e.dataset.folder; // Get the folder name from the card's data attribute
      await getSongs(`songs/${folder}`);
    });
  });
}



// Main function to initialize the application
let main = async () => {
  songs = await getSongs("songs/Atif Aslam/");

  DisplayAlbums();
  // Add event listeners to cards for folder selection
  
  // Attach play/pause toggle functionality
  let play = document.getElementById("play");
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
    }
  });

  // Attach event listener for duration update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;

    let circle = document.querySelector(".circle");
    let progress = (currentSong.currentTime / currentSong.duration) * 100;
    circle.style.left = progress + "%";

    if (currentSong.currentTime === currentSong.duration) {
      play.src = "images/play.svg";
      circle.style.left = "0";
      currentSong.currentTime = 0;
    }
  });

  // Event listener for seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Volume adjustment
  let volumeInput = document.querySelector(".range input");
  volumeInput.addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  // Mute/Unmute button
  let volumebtn = document.querySelector(".volumebtn");
  volumebtn.addEventListener("click", () => {
    if (currentSong.volume > 0) {
      currentSong.volume = 0;
      volumeInput.value = "0"
      volumebtn.src = "images/noVolume.svg";
    } else {
      currentSong.volume = .5;
      volumeInput.value = "50"
      volumebtn.src = "images/volume.svg";
    }
  });

  // Next song functionality
  document.querySelector("#next").addEventListener("click", () => {
    const currentSrc = currentSong.src.split("/").pop();
    const index = songs.findIndex((song) => song.split("/").pop() === currentSrc);

    if (index >= 0 && index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      console.log("No next song available");
    }
  });

  // Previous song functionality
  document.querySelector("#previous").addEventListener("click", () => {
    const currentSrc = currentSong.src.split("/").pop();
    const index = songs.findIndex((song) => song.split("/").pop() === currentSrc);

    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      console.log("No previous song available");
    }
  });

  // Hamburger menu functionality
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Close menu functionality
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
};

// Run the main function
main();
