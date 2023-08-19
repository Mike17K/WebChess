const speed = 5;

export default function VisitorsMoveLogic() {
    document.querySelectorAll('.visitor').forEach(visitor => {

    const velocity_x_attr = visitor.getAttribute('velocity_x')
    let velocity_x = parseFloat(velocity_x_attr);
    if (velocity_x_attr == null || velocity_x_attr == undefined || isNaN(velocity_x)) {
      visitor.setAttribute('velocity_x', Math.random()*speed  );
      velocity_x = parseFloat(visitor.getAttribute('velocity_x'));
    }

    const velocity_y_attr = visitor.getAttribute('velocity_y')
    let velocity_y = parseFloat(velocity_y_attr);
    if (velocity_y_attr == null || velocity_y_attr == undefined || isNaN(velocity_y)) {
      visitor.setAttribute('velocity_y', Math.sqrt(speed*speed - velocity_x*velocity_x)  );
      velocity_y = parseFloat(visitor.getAttribute('velocity_y'));
    }

visitor.style.top = `${parseInt(visitor.style.top || "100px") + velocity_y}px`;

visitor.style.left = `${parseInt(visitor.style.left || "100px") + velocity_x}px`;

if (parseInt(visitor.style.top) > window.innerHeight - 40) {
  visitor.setAttribute('velocity_y', -1*velocity_y);
}
if (parseInt(visitor.style.top) < 0) {
  visitor.setAttribute('velocity_y', -1*velocity_y);
}
if (parseInt(visitor.style.left) > window.innerWidth - 40) {
  visitor.setAttribute('velocity_x', -1*velocity_x);
}
if (parseInt(visitor.style.left) < 0) {
  visitor.setAttribute('velocity_x', -1*velocity_x);
}

// bounce on the box of chess too
const chessboard = document.querySelector('.ChessBoard');
if (chessboard) {
  const chessboard_x = chessboard.getBoundingClientRect().x;
  const chessboard_y = chessboard.getBoundingClientRect().y;
  const chessboard_width = chessboard.getBoundingClientRect().width;
  const chessboard_height = chessboard.getBoundingClientRect().height;
  
  const next_x = parseInt(visitor.style.left) + velocity_x;
  const next_y = parseInt(visitor.style.top) + velocity_y;

  if(next_x > chessboard_x - 40 && next_x < chessboard_x + chessboard_width && next_y > chessboard_y- 40 && next_y < chessboard_y + chessboard_height) {
    // colision
    if(velocity_x>0 && velocity_y>0){ // bug here TODO
      // moving right and down
      // posible colision on the left side and the top side
      if(parseInt(visitor.style.left) < chessboard_x  ){ // colision on the left side
        visitor.setAttribute('velocity_x', -1*velocity_x)
        visitor.style.left = `${chessboard_x - 40}px`;
      }else{
        // colision on the top side
        visitor.setAttribute('velocity_y', -1*velocity_y)
        visitor.style.top = `${chessboard_y - 40}px`;
      }
      
    }else if(velocity_x>0 && velocity_y<0){
      // moving right and up
      // posible colision on the left side and the bottom side
      if(parseInt(visitor.style.left) <= chessboard_x ){ // colision on the left side
        visitor.setAttribute('velocity_x', -1*velocity_x)
        visitor.style.left = `${chessboard_x - 40}px`;
      }else{
        // colision on the bottom side
        visitor.setAttribute('velocity_y', -1*velocity_y)
        visitor.style.top = `${chessboard_y + chessboard_height}px`;
      }
      
    }else if(velocity_x<0 && velocity_y>0){
      // moving left and down
      // posible colision on the right side and the top side
      if(parseInt(visitor.style.left) + 40 >= chessboard_x + chessboard_width ){ // colision on the right side
        visitor.setAttribute('velocity_x', -1*velocity_x)
        visitor.style.left = `${chessboard_x + chessboard_width}px`;
      }else{
        // colision on the top side
        visitor.setAttribute('velocity_y', -1*velocity_y)
        visitor.style.top = `${chessboard_y - 40}px`;
      }
      
    }else if(velocity_x<0 && velocity_y<0){
      // moving left and up
      // posible colision on the right side and the bottom side
      if(parseInt(visitor.style.left) + 40 >= chessboard_x + chessboard_width ){ // colision on the right side
        visitor.setAttribute('velocity_x', -1*velocity_x)
        visitor.style.left = `${chessboard_x + chessboard_width}px`;
      }else{
        // colision on the bottom side
        visitor.setAttribute('velocity_y', -1*velocity_y)
        visitor.style.top = `${chessboard_y + chessboard_height}px`;
      }
    }
    
  }
}

    });
}