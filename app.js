const req = new XMLHttpRequest();//делаем запрос на получение данных из файла json
req.open("GET", "data.json", true);
req.onreadystatechange = outData;   // обработчик
req.send(null);

function outData(){
    if (req.readyState == 4 && req.status == 200){ //если ответ от сервера пришел 4 и 200
        const data = eval('(' + req.responseText + ')'); //возвращаем ответ от сервера в виде строки
        let out = ''; //переменная для вывода данных на страницу
        for (item of data){ //перебираем данные из json и добавляем в ячейки
            // console.log(item)
            out += `<tr d=${item.id}>
                    <td>${item.name.firstName}</td>
                    <td>${item.name.lastName}</td>
                    <td class="about_text">${item.about}</td>
                    <td bgColor=${item.eyeColor}>${item.eyeColor}</td>
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
    console.log('click') 
    function compare(rowA, rowB) { //ф-я, которая будет сравнивать одну строчку с другой
        const rowDataA = rowA.cells[index].innerHTML; //значение одной ячейки
        const rowDataB = rowB.cells[index].innerHTML; //значение второй ячейки
        if(rowDataA < rowDataB) return -1; 
        else if(rowDataA > rowDataB) return 1;
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
        edit.classList.remove('remove_active'); //удаляем класс, чтобы div был виден
        edit.innerHTML = element.innerHTML; //текст из ячейки копируем в div
        edit.contentEditable = true; //включаем возможность редактирования
        edit.focus(); //устанавливаем фокус на div 
        btn.classList.add('active'); // добавляем кнопке класс, чтобы кнопка была видна на стр
        console.log(element.innerHTML);
    }
    btn.addEventListener('click', function(){ //вешаем слушателя на кнопку
        btn.classList.remove('active');//удаляем класс, чтобы кнопка исчезла
        element.innerHTML = edit.innerHTML; //текст, который редактировали записываем в ячейку
        edit.classList.add('remove_active'); //добавляем
        edit.contentEditable = false;//выкл возможность редактирования

    })
}

   //ф-я для обрезки about
// function cutOffStr(){
//     //максимальная длина строки
//     let size = 100;
//     //получаем все эл-ты about
//     let content= document.querySelectorAll('.about_text');
//     //перебираем коллекцию NodeList
//     content.forEach(function(item){
//         //получаем текст в эл-те
//         let text = item.innerHTML;
//         //задаем новую пустую строчку
//         let newText = '';
//         //если длина текста больше заданного, то обрезаем и добавляем три точки
//         if(text.length>size){
//             newText= text.substring(0,size)+ '...'
//         }
//         //перезаписываем новый текст и выводим
//         item.innerHTML = newText
//     })
// }