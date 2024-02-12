let currentSongs = new Audio();
const play = document.getElementById('play');
const previous = document.getElementById('previous')
const next = document.getElementById('next')
let currFolder = 0;

let songs;

function secondsToMinute(seconds){
    if(isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }

    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);
    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`
}

const playMusic = (track,pause=false) => {
    const classname = track.className;
    console.log("track",track);
    // console.log(classname);
    // console.log('tt');
    // console.log(document.getElementById('#' + classname));
    // if(currentSongs.src.includes(track.innerHTML)){
    //     currentSongs.src = '';
    //     // console.log(document.querySelector('.playnow').getAttribute());
    //     document.querySelector('.playnow').innerHTML = '<img class="invert" src="./assets/play-button.png" alt="">';
        
    // }
    // else{
    //     currentSongs.src = ('/songs/' + track.innerHTML + '_320(PaglaSongs).mp3');
    //     console.log(currentSongs.src);
    //     currentSongs.play();
    //     document.querySelector('.playnow').innerHTML = '<img class="invert" src="./assets/pause.png" alt="">'
    // }
    if(String(track).includes('.mp3')){
        currentSongs.src = track;
        document.querySelector(".songinfo").innerHTML = track.replace(`http://127.0.0.1:5500/songs/${currFolder}/`,'').replace('_320(PaglaSongs).mp3','');
        play.src = './assets/play-button.png'
        
    }else{
        currentSongs.src = ('/songs/' + currFolder + '/' + track.innerHTML + '_320(PaglaSongs).mp3');
        document.querySelector(".songinfo").innerHTML = track.innerHTML;
        play.src = './assets/pause.png';
    }
    
    currentSongs.play();
    
    document.querySelector(".songtime").innerHTML = '00:00 / 00:00';
}

async function getSongs(folder){
    currFolder = folder
    const response = await fetch(`http://127.0.0.1:5500/songs/${folder}`)
    const data = await response.text();
    const div = document.createElement('div');
    div.innerHTML = data;
    const as = div.getElementsByTagName('a');
    songs = [];
    for(i = 0 ; i < as.length ; i++){
        const element = as[i];
        if(element.href.endsWith('mp3')){
            songs.push(element.href);
        }
    }

    const ul = document.querySelector('.songNames');
    ul.innerHTML = '';
    for( i = 0 ; i < songs.length ; i++){
        let name = (songs[i].replace(`http://127.0.0.1:5500/songs/${folder}/`,'')).replace('_320(PaglaSongs).mp3','');
        ul.innerHTML = ul.innerHTML + `
        <li>
                    <img class="invert" id = ${i} src="./assets/music-player.png"/>
                    <div class="info">
                        <div class = ${i}>${name}</div>
                    </div>
                    <div class="playnow" id = ${i}>
                       <img class="invert" src="./assets/play-button.png" alt="">
                    </div>
                </li>
        `
    } 

    Array.from(document.querySelector('.songs-list').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click',element =>{
            console.log("info",e.querySelector('.info').firstElementChild);
            playMusic(e.querySelector('.info').firstElementChild);
        })
       
    });
}

async function main(){
    await getSongs('instaviral');
    playMusic(songs[0],true);
   
}

play.addEventListener('click',() => {
    if(currentSongs.paused){
        currentSongs.play();
        play.src = './assets/pause.png';
    }else{
        currentSongs.pause();
        play.src = './assets/play-button.png';
    }
})

currentSongs.addEventListener('timeupdate',() => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinute(currentSongs.currentTime)} / ${secondsToMinute(currentSongs.duration)}`
    const circle = document.querySelector(".circle");
    circle.style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%"; 
})

document.querySelector(".seekbar").addEventListener("click",(e) => {
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
    document.querySelector('.circle').style.left= percent + '%';
    currentSongs.currentTime = ((currentSongs.duration) * percent)/100;
})

document.querySelector('.menu-btn').addEventListener('click',() => {
    document.querySelector('.left').style.left = '0px';
})

document.querySelector('.cross').addEventListener('click',() => {
    document.querySelector('.left').style.left = '-100%';
})


previous.addEventListener('click',() => {
    let index = songs.indexOf(currentSongs.src);
   
    if(index-1 < 0){
        playMusic(songs[songs.length-1]);
        play.src = './assets/pause.png';
    }else{
        playMusic(songs[index-1]);
        play.src = './assets/pause.png';
    }
})
next.addEventListener('click',() => {
    let index = songs.indexOf(currentSongs.src);
    if(songs.length == index + 1){
        playMusic(songs[0]);
        play.src = './assets/pause.png';
    }
    else{
        playMusic(songs[index+1]);
        play.src = './assets/pause.png';
    }
})



Array.from(document.getElementsByClassName('card')).forEach(e => {
    e.addEventListener('click',async (item) => {
         await getSongs(`${item.currentTarget.dataset.folder}`)
    })
})



main();