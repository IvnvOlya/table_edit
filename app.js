const req = new XMLHttpRequest();//делаем запрос на получение данных из файла json
req.open("GET", "data.json", true);
req.onreadystatechange = outData;   // обработчик
req.send(null);

function outData(){
    if (req.readyState == 4 && req.status == 200){ //если ответ от сервера пришел 4 и 200
        const data = eval('(' + req.responseText + ')'); //возвращаем ответ от сервера в виде строки
        let out = ''; //переменная для вывода данных на страницу
        for (item of data){ //перебираем данные из json и добавляем в ячейки
            out += `<tr d=${item.id}>
                    <td>${item.name.firstName}</td>
                    <td>${item.name.lastName}</td>
                    <td class="about_text">${item.about}</td>
                    <td style=background:${item.eyeColor}></td>
                    </tr>`
        }
        document.querySelector('.tbody').innerHTML = out; //выводим данные в таблицу
   }}
const table = document.querySelector('.table_sort');//получаем таблицу
const tbody = document.querySelector('tbody');//получаем тело таблицы, которое будем сортировать
const btn = document.querySelector('.btn');//получаем кнопку
const edit = document.querySelector('.text_edit');//получаем окно редактирования
table.addEventListener('click', f1) //вешаем слушателя на таблицу

function sortTable(index){ //ф-я сортировки таблицы
    function compare(a, b) { //ф-я, которая будет сравнивать одну строчку с другой
        const dataA = a.cells[index].innerHTML; //значение одной ячейки
        const dataB = b.cells[index].innerHTML; //значение второй ячейки
        const styleA = a.cells[index].style.background; //цвет фона первой ячейки
        const styleB = b.cells[index].style.background;//цвет фона второй ячейки

        if(dataA < dataB || styleA < styleB) return -1; 
        else if(dataA > dataB || styleA > styleB) return 1;
        else return 0;
    }

    let rowsArray = [].slice.call(tbody.rows); //получаем массив строк
    // console.log(rowsArray)
    rowsArray.sort(compare); //применяем метод сортировки массива и получим отсортированный массив строчек
    table.removeChild(tbody); //удаляем из табл tbody

    for (let i=0; i<rowsArray.length; i++){ //перебираем эл-ты массива и добавляем в tbody
        tbody.appendChild(rowsArray[i]);
    }
    table.appendChild(tbody); //выводим tbody в table
}

function f1(e) { //ф-я слушателя
    const element = e.target;
    
    if(element.tagName === 'TH') { //если клик  по заголовку таблицы th
    const index = element.cellIndex; //присваиваем переменной index номер ячейки в строке, по которой кликнули
    sortTable(index); //вызываем ф-ю сортировки
    }else if(element.tagName === 'TD') { //если клик по td
        editText(e.target) // вызываем ф-ю редактирования
    }else return;
};

function editText(element){ //ф-я редактирования
    console.log(element)
    if(element){ //если клик по эл-ту
        btn.classList.add('active'); // добавляем кнопке класс, чтобы кнопка была видна на стр
        edit.classList.remove('remove_active'); //удаляем класс, чтобы div был виден
        edit.innerHTML = element.innerHTML; //текст из ячейки копируем в div
        edit.contentEditable = true; //включаем возможность редактирования
        
        edit.focus(); //устанавливаем фокус на div 
        //console.log(element.innerHTML);
    }
    btn.addEventListener('click', function func(){ //вешаем слушателя на кнопку
        btn.classList.remove('active');//удаляем класс, чтобы кнопка исчезла
        edit.classList.add('remove_active'); //добавляем  класс 
        element.innerHTML = edit.innerHTML; //текст, который редактировали записываем в ячейку
        edit.contentEditable = false;//выкл возможность редактирования
    })
}
