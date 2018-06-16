const gray_ramp = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const MAX_CANVAS_WIDTH = 1000;
const MAX_CANVAS_HEIGHT = 1000;


let canvas = document.getElementById('img');
let ctx = canvas.getContext('2d');


let pic_original = new Image();
pic_original.src='image.jpg';
pic_original.onload = () => {
  canvas.width = pic_original.width < MAX_CANVAS_WIDTH ? pic_original.width : MAX_CANVAS_WIDTH;
  canvas.height = pic_original.height < MAX_CANVAS_HEIGHT ? pic_original.height : MAX_CANVAS_HEIGHT;
  ctx.drawImage(pic_original, 0, 0, canvas.width, canvas.height);
  init()
}

const file_selector = document.querySelector('input');
file_selector.onchange = (e) => {
  let file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    let image = new Image();
    image.onload = () => {
      canvas.width = image.width < MAX_CANVAS_WIDTH ? image.width : MAX_CANVAS_WIDTH;
      canvas.height = image.height < MAX_CANVAS_HEIGHT ? image.height : MAX_CANVAS_HEIGHT;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      init();
    }
    image.src = event.target.result;
  }
  reader.readAsDataURL(file);
}

function convert_pixel_to_gray(pixel){
  let gray_value = pixel.red * 0.3 + pixel.green * 0.59 + pixel.blue * 0.11;
  gray_pixel = {
    red:gray_value,
    green:gray_value,
    blue:gray_value,
    alpha:pixel.alpha
  };
  return gray_pixel;

}

function get_pixel(image,x,y){
  let index = (y * image.width + x) * 4;
  let image_data = image.data
  let pixel = {red:image_data[index],
               green:image_data[index+1],
               blue:image_data[index+2],
               alpha:image_data[index+3]};
  return pixel;
}

function set_pixel(image,x,y,pixel){
  let index = (y * image.width + x)*4;
  image.data[index] = pixel.red;
  image.data[index+1] = pixel.green;
  image.data[index+2] = pixel.blue;
  image.data[index+3] = pixel.alpha;
}

function get_ascii(image){
  let height = image.height;
  let width = image.width;
  const step_x = 6;
  const step_y = 10;
  let ascii_str = "";
  for (let y=0; y < image.height; y+= step_y){
    for (let x=0; x < image.width; x+= step_x){
      chunk_size = step_x * step_y;
      gray_value_sum = 0;
      for (let i=0; i<step_x; i+=1){
        for (let j=0; j<step_y; j+=1){
          let pixel = get_pixel(image, x+i, y+j);
          gray_value_sum += pixel.red;
        }
      }
      gray_value_average = gray_value_sum / chunk_size;
      gray_ramp_index = Math.round(gray_value_average / 255 * (gray_ramp.length-1));
      ascii_str += gray_ramp[gray_ramp_index];
    }
    ascii_str += '\n';
  }
  return ascii_str
}

function init(){
  let image = ctx.getImageData(0,0,canvas.width,canvas.height);
  for (let x = 0; x < image.width; x++){
    for (let y = 0; y < image.height; y++){
      let pixel = get_pixel(image,x,y);
      pixel = convert_pixel_to_gray(pixel);
      set_pixel(image, x, y, pixel);
    }
  }
  ascii_str = get_ascii(image)
  document.getElementById('ascii').textContent = ascii_str;
}
