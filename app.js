const table = document.querySelector(".table_sort"); //получаем таблицу
const tbody = document.querySelector("tbody"); //получаем тело таблицы, которое будем сортировать
const btnSave = document.querySelector(".btn_save"); //получаем кнопку
const btnHidden = document.querySelectorAll(".btn_hidden");
const edit = document.querySelector(".text_edit"); //получаем окно редактирования
const pagination = document.querySelector(".pagination"); //получаем список переключения по страницам

let strOnPage = 10; // кол-во строк таблицы на странице

//получаем данные из JSON
const req = new XMLHttpRequest(); //делаем запрос на получение данных из файла json
req.open("GET", "data.json", true); //открываем
req.onreadystatechange = outData; // обработчик, который вызывается, когда меняется состояние св-ва
req.send(null); //запрос отсылается без данных

//ф-я, которая вызывается при изменении св-ва readyState
function outData() {
  if (req.readyState == 4 && req.status == 200) {
    //если ответ от сервера пришел 4 и 200(OK)
    const data = eval("(" + req.responseText + ")"); //возвращаем ответ от сервера в виде строки

    //выводим на стр по 10 строк
    let numberOfItems = Math.ceil(data.length / strOnPage); //кол-во страниц = делим все строки из data на кол-во строк 10
    let numStr = []; // пустой массив

    for (let i = 1; i <= numberOfItems; i++) {
      //перебираем эл-ты от 1 до кол-ва страниц
      let li = document.createElement("li"); //создаем li
      li.innerHTML = i; //присваиваем номера li
      pagination.appendChild(li); //добавляем li в список ul
      numStr.push(li); //добавляем li в массив
    }

    let active; // создаем переменную
    showPage(numStr[0]); //вызываем ф-ю и передаем в нее нулевой эл-т массива(чтобы при загрузке мы сразу видели 1ую страницу табл)

    for (let num of numStr) {
      //перебираем элементы для перехода между страницами
      num.addEventListener("click", function () {
        //при клике на переход стр
        showPage(this); //вызывается ф-я, куда передается этот элемент
      });
    }

    function showPage(item) {
      //ф-я для отображения на странице таблицы
      if (active) {
        active.classList.remove("active"); //если у элемента страница есть класс актив, то удаляем его
      }
      active = item; //присваиваем переменной li

      item.classList.add("active"); //добавляем класс актив, чтобы подсветить страницу, на которой мы находимся
      let pageNum = +item.textContent; //создаем переменную и присваиваем номер стр

      let start = (pageNum - 1) * strOnPage; //начальное значение = номер стр - 1 и умножаем на кол-во строк на странице =0
      let end = start + strOnPage; //конечное значение начальное плюс кол-во строк на странице =10

      let notes = data.slice(start, end); // вырезаем из объекта элементы с 0 по 10
      let out = ""; //присваиваем переменной пустую строку
      for (let note of notes) {
        //перебираем эл-ты массива
        out += `<tr id=${note.id}> 
            <td>${note.name.firstName}</td>
            <td>${note.name.lastName}</td>
            <td class="about_text">${note.about}</td>
            <td style=background:${note.eyeColor}></td>
            </tr>`;
      }
      document.querySelector(".tbody").innerHTML = out; //выводим строки в таблицу

      editText(); //вызываем ф-ю редактировая
    }
  }
}

table.addEventListener("click", f1); //вешаем слушателя на табл

function sortTable(index) {
  //ф-я сортировки таблицы
  function compare(a, b) {
    //ф-я, которая будет сравнивать одну строчку с другой
    const dataA = a.cells[index].innerHTML; //значение одной ячейки
    const dataB = b.cells[index].innerHTML; //значение второй ячейки
    const styleA = a.cells[index].style.background; //цвет фона первой ячейки
    const styleB = b.cells[index].style.background; //цвет фона второй ячейки

    if (dataA < dataB || styleA < styleB) return -1;
    //если значение одной ячейки больше второй то возвращаем -1
    else if (dataA > dataB || styleA > styleB) return 1;
    // если меньше, то возвращаем 1
    else return 0; // или не то и не то, то возвращаем 0
  }

  let rowsArray = [].slice.call(tbody.rows); //получаем массив строк
  // console.log(rowsArray)
  rowsArray.sort(compare); //применяем метод сортировки массива и получим отсортированный массив строчек
  table.removeChild(tbody); //удаляем из табл tbody

  for (let i = 0; i < rowsArray.length; i++) {
    //перебираем эл-ты массива и добавляем в tbody
    tbody.appendChild(rowsArray[i]);
  }
  table.appendChild(tbody); //выводим tbody в table
}

function f1(e) {
  //ф-я слушателя
  const element = e.target;
  //console.log(this)

  if (element.tagName === "TH") {
    //если клик  по заголовку таблицы th
    const index = element.cellIndex; //присваиваем переменной index номер ячейки в строке, по которой кликнули
    sortTable(index); //вызываем ф-ю сортировки
    console.log("click");
  }
  else return;
}

function changeTextBtnHidden(column) {
  //ф-я изменения текст кнопки при нажатии
  const btnHidden = document.querySelectorAll(".btn_hidden"); //получаем кнопки
  const arrBtnHidden = Array.prototype.slice.call(btnHidden); // NodeList в массив
  const textBtnHidden = arrBtnHidden[column].textContent; // получаем текст кнопки, которую нажали

  if (textBtnHidden === "Hide") {
    // если текст кнопки Hide
    arrBtnHidden[column].textContent = "Show"; // то меняем текст на Show
  } else {
    // если текст кнопки, не Hide
    arrBtnHidden[column].textContent = "Hide"; // то меняем текст на Hide
  }
}

function hide(column) {
  //ф-я клика на кнопку для показать/скрыть столбец
  changeTextBtnHidden(column); //вызываем ф-ю изменения текст на кнопке при клике

  for (let i = 0; i < table.rows.length; i++) {
    // перебираем ячейки
    table.rows[i].cells[column].classList.toggle("hidden"); // при клике на кнопку добавляем или убираем ячейкам одного столбца класс hidden
  }
}
function editText() {
  //ф-я редактирования
  const tds = document.querySelectorAll("td"); //получаем все эл-ты td
  for (let i = 0; i < tds.length; i++) {
    //перебираем эл-ты
    tds[i].addEventListener("click", function f2() {
      //вешаем слушателя
      console.log(tds[i]);

      const form = document.createElement("form"); //создаем формы редактирования
      const textarea = document.createElement("textarea");
      textarea.style.height = "200px";
      textarea.style.width = "300px";
      const inputBtn = document.createElement("input");
      inputBtn.type = "submit";

      edit.appendChild(form);
      form.appendChild(textarea);
      form.appendChild(inputBtn);

      textarea.value = this.innerHTML; // присваиваем переменной текст из td, на котором был клик
    
      let td = this;
      textarea.addEventListener("blur", function () {
        //вешаем событие на форму
        td.innerHTML = this.value; //перезаписываем новвые данные
        textarea.parentNode.removeChild(textarea); //удаляем textarea inputBtn form
        inputBtn.parentNode.removeChild(inputBtn);
        form.parentNode.removeChild(form);
      });
    });
  }
}
