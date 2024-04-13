document.addEventListener('DOMContentLoaded', function() {
    // Mengambil semua elemen video
    const videos = document.querySelectorAll('.slide-video');

    // Mengambil semua radio button dengan nama 'slide'
    const radioButtons = document.querySelectorAll('input[name="slide"]');

    // Menambahkan event listener pada setiap radio button
    radioButtons.forEach((radio) => {
        radio.addEventListener('change', function() {
            // Mematikan semua video
            videos.forEach((video) => {
                video.pause();
                video.currentTime = 0; // Mengatur ulang waktu video ke awal
            });

            // Memilih video untuk slide yang dipilih
            const selectedVideo = this.nextElementSibling.querySelector('.slide-video');
            
            // Memainkan video yang dipilih
            if (selectedVideo) {
                selectedVideo.play();
            }
        });
    });

    // Autoplay video pada slide pertama
    videos[0].play();
});

// Daftar semua lagu
let allMusic = [
    {
        name: "Masdddho - Dumes",
        artist: "Masdddho",
        img: "dumes",
        src: "dumes"
    },
    {
        name: "Masdddho - Kisinan 2",
        artist: "Masdddho",
        img: "kisinan-2",
        src: "kisinan2"
    },
    {
        name: "Masdddho - Kisinan",
        artist: "Masdddho",
        img: "kisinan",
        src: "kisinan"
    },
    {
        name: "Masdddho - Nemen",
        artist: "Masdddho",
        img: "nemen",
        src: "nemen"
    },
    {
        name: "Masdddho - Nemu",
        artist: "Masdddho",
        img: "nemu",
        src: "nemu"
    },
    {
        name: "Masdddho - Samar",
        artist: "Masdddho",
        img: "samar",
        src: "samar"
    },
    {
        name: "Masdddho - Tenanan",
        artist: "Masdddho",
        img: "Tenanan",
        src: "tenanan"
    },
]

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .nama"),
musicArtist = wrapper.querySelector(".song-details .artis"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
});

// Fungsi untuk memuat informasi musik
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `assets/images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `assets/music/${allMusic[indexNumb - 1].src}.mp3`;
}

// Fungsi untuk memainkan musik
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// Fungsi untuk menjeda musik
function pausedMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// Fungsi untuk memutar musik berikutnya
function nextMusic(){
   musicIndex++;
   musicIndex > allMusic.length ? musicIndex  = 1 : musicIndex  = musicIndex;
   loadMusic(musicIndex);
   playMusic();
}

//  Fungsi untuk memutar musik sebelumnya
function prevMusic(){
   musicIndex--;
   musicIndex < 1 ? musicIndex  = allMusic.length : musicIndex  = musicIndex;
   loadMusic(musicIndex);
   playMusic();
   playingNow();
}

// Event listener untuk tombol play/pause
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pausedMusic() : playMusic();
    playingNow();
});

//  Event listener untuk tombol Next dan Prev
nextBtn.addEventListener("click", ()=>{
    nextMusic();
});

prevBtn.addEventListener("click", ()=>{
    prevMusic();
});

// Event listener untuk mengupdate progress bar
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata", ()=>{

        
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ 
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin};${totalSec}`;
    });

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ 
        currentSec = `0${currentSec}`;
    }
    
    musicCurrentTime.innerText = `${currentMin};${currentSec}`;

});

// Event listener untuk mengklik area progress bar
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth; 
    let clickedOffSetX = e.offsetX; 
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

// Event listener untuk tombol ulang
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText; 
    switch(getText){
        case "repeat": 
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one": 
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle": 
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }                              
});

// Event listener untuk saat audio selesai
mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            }while(musicIndex == randIndex);
            musicIndex = randIndex; 
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }   
});

// Event listener untuk tombol tampilkan lebih banyak
showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});
//  Event listener untuk tombol tutup
hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});
// Memuat daftar lagu
const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index"${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio id="${allMusic[i].src}" src="assets/music/${allMusic[i].src}.mp3"></audio>
                    <span id= "${allMusic[i].src}" class="audio-duration">6:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ 
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin};${totalSec}`;
            
        liAudioDuration.setAttribute("t-duration", `${totalMin};${totalSec}`);
    });
}
// Fungsi untuk menampilkan lagu yang sedang diputar
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        allLiTags[j].setAttribute("onclick", "clicked(this)");
}
}
// Fungsi untuk mengatur lagu yang diputar saat lagu diklik dari daftar
function clicked(element){
        let getLiIndex = element.getAtribute("li-index");
        musicIndex = getLiIndex; 
        loadMusic(musicIndex);
        playMusic();
    }


