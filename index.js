let currentSongs = new Audio();

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
    const ul = document.querySelector('.songNames');
    for( i = 0 ; i < songs.length ; i++){
        let name = (songs[i].replace('http://127.0.0.1:5500/songs/','')).replace('_320(PaglaSongs).mp3','');
        ul.innerHTML = ul.innerHTML + `
        <li>
                    <img class="invert" src="./assets/music-player.png"/>
                    <div class="info">
                        <div>${name}</div>
                    </div>
                    <div class="playnow">
                        <img class="invert" src="./assets/play-button.png" alt="">
                    </div>
                </li>
        `
    } 

    const playMusic = (track) => {
        console.log(track);
        // const audio = new Audio();
        currentSongs.src = ('/songs/' + track + '_320(PaglaSongs).mp3')
        currentSongs.play();
    }

    Array.from(document.querySelector('.songs-list').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click',element =>{
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            playMusic(e.querySelector('.info').firstElementChild.innerHTML);
        })
       
    });
}

main();