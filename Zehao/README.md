# Microsoft-Capstone
# first commit


10.16


html：

<!DOCTYPE html>
<html>
<head>
  <title>Animals Around the World</title>
</head>
<body>
  <h1>The Brown Bear</h1>
  <!-- A section that describes the brown bear -->
  <p>The brown bear (Ursus arctos) is native to parts of northern Eurasia and North America. Its conservation status is currently "Least Concern." There are many subspecies within the brown bear species, including the Atlas bear and the Himalayan brown bear.</p>
  <a href="https://en.wikipedia.org/wiki/Brown_bear">Learn More</a>
  <p>Here are some bear species:</p>
  <ul>
    <li>Arctos</li>
    <li>Collarus</li>
    <li>Horribilis</li>
    <li>Nelsoni (extinct)</li>
  </ul>
  <p>The following countries have the largest populations of brown bears:</p>
  <ol>
    <li>Russia</li>
    <li>United States</li>
    <li>Canada</li>
  </ol>
  <a href="" target="">
    <img src="https://s3.amazonaws.com/codecademy-content/courses/web-101/web101-image_brownbear.jpg" /></a>
</body> 
</html>





javascript:

1. content position 

<script>  ..content..  </script>


2. javascript will write text in the body of html

<!DOCTYPE html>
<html>
<body>
.
.
<script>
document.write("<h1>h1</h1>");
document.write("<p>p1</p>");
</script>
.
.
</body>
</html>

3. event->function

<!DOCTYPE html>
<html>
<head>
  //function in head
<script>
function myFunction()
{
document.getElementById("demo").innerHTML="我的第一个 JavaScript 函数";
}
</script>
  //end of function
</head>
<body>
<h1>我的 Web 页面</h1>
<p id="demo">一个段落</p>
  //here is okay
<button type="button" onclick="myFunction()">尝试一下</button>

  // here is okay (outside) <script src="myScript.js"></script>
</body>
</html>

4. did not print anything, but it could do it through other ways
使用 window.alert() 弹出警告框。
<script>
window.alert(5 + 6);
</script>

使用 document.write() 方法将内容写到 HTML 文档中。
<script>
document.getElementById("demo").innerHTML="段落已修改。";
</script>

使用 innerHTML 写入到 HTML 元素。



使用 console.log() 写入到浏览器的控制台






