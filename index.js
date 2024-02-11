let currentSongs = new Audio();
const play = document.getElementById('play');
console.log(play);

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
    console.log("t",track);
    const classname = track.className;
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
        document.querySelector(".songinfo").innerHTML = track.replace('http://127.0.0.1:5500/songs/','').replace('_320(PaglaSongs).mp3','');
        play.src = './assets/play-button.png'
        
    }else{
        currentSongs.src = ('/songs/' + track.innerHTML + '_320(PaglaSongs).mp3');
        document.querySelector(".songinfo").innerHTML = track.innerHTML;
        play.src = './assets/pause.png';
    }
    
    currentSongs.play();
    
    document.querySelector(".songtime").innerHTML = '00:00 / 00:00';
}

async function getSongs(){
    const response = await fetch('http://127.0.0.1:5500/songs/')
    const data = await response.text();
    const div = document.createElement('div');
    div.innerHTML = data;
    const as = div.getElementsByTagName('a');
    const songs = [];
    for(i = 0 ; i < as.length ; i++){
        const element = as[i];
        if(element.href.endsWith('mp3')){
            songs.push(element.href);
        }
    }
    return songs;
}

async function main(){
    const songs = await getSongs();
    console.log(songs);
    playMusic(songs[0],true);
    console.log(songs[1]);
    const ul = document.querySelector('.songNames');
    for( i = 0 ; i < songs.length ; i++){
        let name = (songs[i].replace('http://127.0.0.1:5500/songs/','')).replace('_320(PaglaSongs).mp3','');
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
            console.log(e.querySelector('.info').firstElementChild);
            playMusic(e.querySelector('.info').firstElementChild);
        })
       
    });

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
        // console.log(currentSongs.currentTime,currentSongs.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinute(currentSongs.currentTime)} / ${secondsToMinute(currentSongs.duration)}`
        const circle = document.querySelector(".circle");
        // console.log(circle);
        circle.style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%"; 
    })

    document.querySelector(".seekbar").addEventListener("click",(e) => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        document.querySelector('.circle').style.left= percent + '%';
        currentSongs.currentTime = ((currentSongs.duration) * percent)/100;
    })
}




main();