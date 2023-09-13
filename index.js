const canvas = document.getElementById('mycanvas')
const ctx = canvas.getContext('2d')
let cnvmeasures = 400
document.getElementById('mycanvas').width = cnvmeasures*1.5
document.getElementById('mycanvas').height = cnvmeasures
let oldballpos = []
let newballpos = []
let ballanimation = null
let bx = 0
let by = 0
let velx = 0
let vely = 0
let rectmeasure = 20
//check if platform should go up or down
let checkL = 0
let checkR = 0
//pos the platforms in the center
let Lplatpos = [[0,canvas.height/2-(2*rectmeasure)],[0,canvas.height/2-rectmeasure],[0,canvas.height/2],[0,canvas.height/2+rectmeasure],[0,canvas.height/2+(2*rectmeasure)]]
let Rplatpos = [[cnvmeasures*1.5-rectmeasure,canvas.height/2-(2*rectmeasure)],[cnvmeasures*1.5-rectmeasure,canvas.height/2-rectmeasure],[cnvmeasures*1.5-rectmeasure,canvas.height/2],[cnvmeasures*1.5-rectmeasure,canvas.height/2+rectmeasure],[cnvmeasures*1.5-rectmeasure,canvas.height/2+(2*rectmeasure)]]
let platlength = 5 //5 rect of 20 px
let leftscore = 0
let rightscore = 0
//how to play
ctx.font = "bold 18px Arial"
ctx.fillText('Commands:',(canvas.width / 2.4), (canvas.height / 2)-150)
ctx.fillText('W = Up',(canvas.width / 2.4) - 170, (canvas.height / 2) - 70)
ctx.fillText('S = Down',(canvas.width / 2.4) - 170, (canvas.height / 2) - 50)
ctx.fillText('ArrowUp = Up',(canvas.width / 2.4) + 150, (canvas.height / 2) - 70)
ctx.fillText('ArrowDown = Down',(canvas.width / 2.4) + 150, (canvas.height / 2) - 50)
//start
document.getElementById('startbutton').onclick = function (){
    //clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    document.getElementById('startbutton').disabled = true
    //reset
    document.getElementById('resetbutton').onclick = function (){
        location.reload()
    }
    //aesthetic line
    ctx.beginPath()
    ctx.moveTo(300,0)
    ctx.lineTo(300,400)
    ctx.stroke()
    //deals with the ball
    function main(){
    function newball(){
        bx = Math.floor(Math.random()*20)+280
        by = Math.floor(Math.random()*(canvas.height-20))
        newballpos = [bx,by]
        //random direction
        velx = Math.random() < 0.5 ? -1 : 1
        vely = (Math.random() < 0.5 ? -1 : 1)*Math.random()
        return newballpos
    }
    newball()
    //clear the old one before creating the new
    function ballcreation(){
        ctx.clearRect(oldballpos[0], oldballpos[1], rectmeasure, rectmeasure)
        ctx.beginPath()
        ctx.fillStyle = 'red'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.rect(newballpos[0],newballpos[1],rectmeasure,rectmeasure)
        ctx.fill()
        ctx.stroke()
        //aesthetic line
        ctx.beginPath()
        ctx.moveTo(300,0)
        ctx.lineTo(300,400)
        ctx.strokeStyle = 'black'
        ctx.stroke()
        
        
    }
    ballcreation()
    //animation
    ballanimation = setInterval(ballmovement, 1)
    function ballmovement(){
        oldballpos = newballpos
        bx += velx
        by += vely
        collisionwithplat()
        scoring()
        collisionwithsides()
        newballpos = [bx,by]
        ballcreation()
    }

    //ball collisions
    function collisionwithplat(){
        if(velx < 0 && newballpos[0] <= rectmeasure + 3 && newballpos[1] <= Lplatpos[4][1] + rectmeasure && newballpos[1] + rectmeasure >= Lplatpos[0][1]){
            velx = -velx*1.1
        }
        else if(velx > 0 && newballpos[0] >= canvas.width-rectmeasure - 3 && newballpos[1] <= Rplatpos[4][1] + rectmeasure && newballpos[1] + rectmeasure >= Rplatpos[0][1]){
            velx = -velx*1.1
        }
        else if(velx > 0 && newballpos[0] + rectmeasure >= canvas.width-rectmeasure  - 3 && newballpos[1] <= Rplatpos[4][1] + rectmeasure && newballpos[1] + rectmeasure >= Rplatpos[0][1]){
            velx = -velx*1.1
        }
    }
    function collisionwithsides(){

        if(vely < 0 && newballpos[1] < 0){
            vely = -vely
        }
        else if(vely > 0 && newballpos[1] > (canvas.height - rectmeasure)){
            vely = -vely
        }

    }
    function scoring(){
        if(newballpos[0] <= 0){
            Rscore()
            clearInterval(ballanimation)
            main()
        }
        if(newballpos[0] >= canvas.width){
            Lscore()
            clearInterval(ballanimation)
            main()
        }
    }
    }main()
    //keep track of score
    function Lscore(){
        leftscore += 1
        document.getElementById('scoreleft').innerHTML = leftscore
    }
    function Rscore(){
        rightscore += 1
        document.getElementById('scoreright').innerHTML = rightscore
    }
    //create and 'move' the platforms
    function Rplat(){
        if(checkR == 1 && Rplatpos[4][1] <= 380){
            Rplatpos.push([Rplatpos[4][0],Rplatpos[4][1]+rectmeasure])
            Rplatpos.shift()
        }
        else if(checkR == 2 && Rplatpos[0][1] >= 0){
            Rplatpos.pop()
            Rplatpos.unshift([Rplatpos[0][0],Rplatpos[0][1]-rectmeasure])
        }
        ctx.clearRect(canvas.width-20, 0, rectmeasure, canvas.height)
        ctx.beginPath()
        for(let i = 0; i < platlength; ++i){
            ctx.rect(Rplatpos[i][0],Rplatpos[i][1],rectmeasure,rectmeasure)
            ctx.fillStyle = 'black'
            ctx.fill()
        }
    }
    Rplat()
    function Lplat(){
        if(checkL == 1 && Lplatpos[4][1] <= 380){
            Lplatpos.push([Lplatpos[4][0],Lplatpos[4][1]+rectmeasure])
            Lplatpos.shift()
        }
        else if(checkL == 2 && Lplatpos[0][1] >= 0){
            Lplatpos.pop()
            Lplatpos.unshift([Lplatpos[0][0],Lplatpos[0][1]-rectmeasure])
        }
        ctx.clearRect(0, 0, rectmeasure, canvas.height)
        ctx.beginPath()
        for(let i = 0; i < platlength; ++i){
            ctx.rect(Lplatpos[i][0],Lplatpos[i][1],rectmeasure,rectmeasure)
            ctx.fillStyle = 'black'
            ctx.fill()
        }
    }
    Lplat()
    //keypresses
    window.addEventListener('keydown',movement)
    function movement(event){
        switch(event.key){
            case 'w':
                checkL = 2
                Lplat()
                break
            case 's':
                checkL = 1
                Lplat()
                break
            case 'ArrowUp':
                checkR = 2
                Rplat()
                break
            case 'ArrowDown':
                checkR = 1
                Rplat()
                break
        }
    }
}
