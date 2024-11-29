var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// import { GenerateTableData } from './generateTableData'
var GenerateTableData = /** @class */ (function () {
    function GenerateTableData(tableData, appInstance) {
        var _this = this;
        this.map = new Map();
        tableData.forEach(function (table) {
            _this.map.set(table.name, table.data);
        });
        this.app = appInstance;
    }
    GenerateTableData.prototype.getAppHtml = function (build) {
        this.app.appendChild(build);
    };
    GenerateTableData.prototype.createElement = function (type, className, innerHTML) {
        if (className === void 0) { className = ""; }
        if (innerHTML === void 0) { innerHTML = ""; }
        var ele = document.createElement(type);
        ele.className = className;
        ele.innerHTML = innerHTML;
        return ele;
    };
    GenerateTableData.prototype.generateTables = function () {
        var _this = this;
        var build = "";
        var mainDiv = this.createElement('div', 'padding');
        this.map.keys().forEach(function (key, value) {
            var h2 = _this.createElement('h4', "text-center", "<b>Table ".concat(value + 1, ": ").concat(key, "</b>"));
            mainDiv.appendChild(h2);
            var table = _this.createElement('table', 'table table-bordered table-hover text-center align-middle');
            var thead = _this.createElement('thead', 'table-dark');
            thead.appendChild(_this.generateTableHead(_this.map.get(key), value, key, key.split(' ').join('_')));
            var tBody = _this.generateTableBodyData(_this.map.get(key), key, key.split(' ').join('_'), value);
            table.appendChild(thead);
            table.appendChild(tBody);
            mainDiv.appendChild(h2);
            mainDiv.appendChild(table);
            mainDiv.appendChild(_this.addItemInForm(key, tBody.id));
            mainDiv.appendChild(_this.createElement('hr'));
        });
        this.getAppHtml(mainDiv);
    };
    GenerateTableData.prototype.addItemInForm = function (key, tdId) {
        var fContainer = this.createElement('div');
        var h5 = this.createElement('h5', "text-center", "<b>Add ".concat(key, "</b>"));
        fContainer.appendChild(h5);
        var form = this.createElement('form', 'padding mb-2');
        var fdiv = this.createElement('div', 'form-group');
        var lable = this.createElement('label', "", "Name:");
        var input = this.generateInputElement('text', 'form-control', 'Name of the animal', "".concat(tdId, "_name"));
        fdiv.appendChild(lable);
        fdiv.appendChild(input);
        lable = this.createElement('label', "", "Size:");
        input = this.generateInputElement('number', 'form-control', 'Size of the animal', "".concat(tdId, "_size"));
        fdiv.appendChild(lable);
        fdiv.appendChild(input);
        lable = this.createElement('label', "", "Location:");
        input = this.generateInputElement('text', 'form-control', 'Location of the animal', "".concat(tdId, "_location"));
        fdiv.appendChild(lable);
        fdiv.appendChild(input);
        form.appendChild(fdiv);
        form.appendChild(this.generateSubmitButton(key, tdId));
        fContainer.appendChild(form);
        return fContainer;
    };
    GenerateTableData.prototype.generateSubmitButton = function (key, tdId) {
        var btn = this.createElement('button', 'btn btn-primary mt-1', 'Submit');
        btn.type = 'submit';
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            app.addAnimal(key, tdId);
        });
        return btn;
    };
    GenerateTableData.prototype.generateInputElement = function (type, clas, placeholder, id, value) {
        if (value === void 0) { value = ""; }
        var input = this.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.className = clas,
            input.id = id;
        if (value != "") {
            input.value = value;
        }
        return input;
    };
    GenerateTableData.prototype.generateTableHead = function (singleRow, tableNum, key, tdId) {
        var _this = this;
        var tr = this.createElement('tr', "table-head");
        for (var _i = 0, singleRow_1 = singleRow; _i < singleRow_1.length; _i++) {
            var data = singleRow_1[_i];
            tdId = "".concat(tdId, "-").concat(tableNum);
            Object.keys(data).forEach(function (columnHead) {
                var th = _this.createElement('th');
                th.innerText = "".concat(columnHead);
                th.appendChild(_this.generateSortButton(columnHead, tableNum, key, tdId));
                tr.appendChild(th);
            });
            var th = this.createElement('th');
            th.innerText = "Action";
            tr.appendChild(th);
            break;
        }
        return tr;
    };
    GenerateTableData.prototype.generateSortButton = function (columnHead, tableNumber, key, tdId) {
        var btn = this.createElement('button', 'btn btn-sm btn-light', '<i class="fa fa-sort"></i>');
        if ((tableNumber == 0 && columnHead != 'image') || (tableNumber == 1 && (columnHead == 'name' || columnHead == 'location')) || (tableNumber == 2 && columnHead == 'size')) {
            btn.addEventListener('click', function () {
                app.sortTableData(tdId, columnHead, key);
            });
            return btn;
        }
        return this.createElement('span');
    };
    GenerateTableData.prototype.sortTable = function (tdId, columanName, key) {
        var tbody = document.getElementById(tdId);
        tbody.innerHTML = "";
        var dataArr = this.map.get(key);
        if (columanName === 'size') {
            dataArr.sort(function (a, b) { return a[columanName] - b[columanName]; });
        }
        else {
            dataArr.sort(function (a, b) { return a[columanName].localeCompare(b[columanName], undefined, { sensitivity: 'base' }); });
        }
        this.generateTableDataRow(key, dataArr, tbody);
    };
    GenerateTableData.prototype.generateTableDataRow = function (key, dataArr, tbody) {
        var idCount = 0;
        var tableNumber = Number.parseInt(tbody.id.split('-')[1]);
        for (var _i = 0, dataArr_1 = dataArr; _i < dataArr_1.length; _i++) {
            var data = dataArr_1[_i];
            var tr = this.createElement('tr');
            tr.id = "".concat(tbody.id + "_" + idCount);
            var td1 = this.createElement('td', "", data['species']);
            td1.id = "".concat(tbody.id + "_" + idCount + "_0");
            var name_1 = data['name'];
            if (tableNumber == 1) {
                name_1 = "<b>".concat(data['name'], "</b>");
            }
            else if (tableNumber === 2) {
                name_1 = "<span style='color:blue'><b><em>".concat(data['name'], "</em></b></span>");
            }
            var td2 = this.createElement('td', "", name_1);
            td2.id = "".concat(tbody.id + "_" + idCount + "_1");
            var td3 = this.createElement('td', "", "".concat(data['size'], "ft."));
            td3.id = "".concat(tbody.id + "_" + idCount + "_2");
            var td4 = this.createElement('td', "", data['location']);
            td4.id = "".concat(tbody.id + "_" + idCount + "_3");
            var td5 = this.createElement('td');
            td5.appendChild(this.generateImageCard(data['image'], data['name']));
            td2.id = "".concat(tbody.id + "_" + idCount + "_4");
            var td6 = this.createElement('td');
            td6.id = "".concat(tbody.id + "_" + idCount + "_5");
            td6.appendChild(this.generateEditButton(key, idCount, tbody.id, tr.id));
            td6.appendChild(this.generateDeleteButton(key, idCount, tbody.id));
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            tbody.appendChild(tr);
            idCount++;
        }
    };
    GenerateTableData.prototype.generateImageCard = function (pth, name) {
        if (name === void 0) { name = ""; }
        if (pth === "") {
            pth = 'data/images/placeholder.jpg';
        }
        var card = this.createElement('div', 'card p-1 image-cntr');
        var img = this.createElement('img', 'card-img-top');
        var div = this.createElement('div', 'overlay', "<b>".concat(name, "</b>"));
        img.src = pth;
        card.appendChild(img);
        card.appendChild(div);
        return card;
    };
    GenerateTableData.prototype.generateDeleteButton = function (key, idxx, tdId) {
        var button = this.createElement('button', 'btn btn-sm btn-danger', '<i class="fa fa-trash"></i>');
        button.addEventListener('click', function () {
            app.deleteAnimal(key, idxx, tdId);
        });
        return button;
    };
    GenerateTableData.prototype.generateEditButton = function (key, idxx, tdId, trId) {
        var button = this.createElement('button', 'btn btn-sm btn-primary margin', '<i class="fa fa-pencil"></i>');
        button.addEventListener('click', function () {
            app.editAnimal(key, idxx, tdId, trId);
        });
        return button;
    };
    GenerateTableData.prototype.generateTableBodyData = function (dataArr, key, tdId, taleNumber) {
        var tbody = this.createElement('tbody', "table-body");
        tbody.id = "".concat(tdId, "-").concat(taleNumber);
        this.generateTableDataRow(key, dataArr, tbody);
        return tbody;
    };
    GenerateTableData.prototype.deleteData = function (key, index, tdId) {
        var td = document.getElementById(tdId);
        td === null || td === void 0 ? void 0 : td.innerHTML = "";
        var data = this.map.get(key);
        data = data === null || data === void 0 ? void 0 : data.filter(function (e, idx) { return idx !== index; });
        this.map.set(key, data);
        this.generateTableDataRow(key, data, td);
    };
    GenerateTableData.prototype.editData = function (key, index, tdId, trId) {
        var td = document.getElementById(tdId);
        td === null || td === void 0 ? void 0 : td.innerHTML = "";
        var data = this.map.get(key);
        this.generateTableDataRow(key, data, td);
        var currentData = data[index];
        var tr = document.getElementById(trId);
        var name = document.getElementById("".concat(trId, "_4"));
        var size = document.getElementById("".concat(trId, "_2"));
        var location = document.getElementById("".concat(trId, "_3"));
        var action = document.getElementById("".concat(trId, "_5"));
        name === null || name === void 0 ? void 0 : name.innerHTML = "";
        name === null || name === void 0 ? void 0 : name.appendChild(this.generateInputElement('text', 'form-control', 'please enter new Name', "".concat(trId, "_4_name"), currentData['name']));
        size === null || size === void 0 ? void 0 : size.innerHTML = "";
        size === null || size === void 0 ? void 0 : size.appendChild(this.generateInputElement('number', 'form-control', 'please enter new Name', "".concat(trId, "_2_size"), currentData['size']));
        location === null || location === void 0 ? void 0 : location.innerHTML = "";
        location === null || location === void 0 ? void 0 : location.appendChild(this.generateInputElement('text', 'form-control', 'please enter new Name', "".concat(trId, "_3_location"), currentData['location']));
        action === null || action === void 0 ? void 0 : action.innerHTML = "";
        action === null || action === void 0 ? void 0 : action.appendChild(this.generateAcceptOrRejectButton('accept', key, index, tdId, trId));
        action === null || action === void 0 ? void 0 : action.appendChild(this.generateAcceptOrRejectButton('reject', key, index, tdId, trId));
    };
    GenerateTableData.prototype.generateAcceptOrRejectButton = function (type, key, idxx, tdId, trId, name, size, location) {
        var _this = this;
        if (name === void 0) { name = ""; }
        if (size === void 0) { size = 0; }
        if (location === void 0) { location = ""; }
        var button = this.createElement('button', "btn btn-sm btn-".concat(type == 'accept' ? 'primary' : 'danger', " margin"), "<i class=\"fa fa-".concat(type == 'accept' ? 'check' : 'times', "\"></i>"));
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (type == 'accept') {
                var newData = __assign({}, _this.map.get(key)[idxx]);
                newData['name'] = _this.getValueFromInputElemetnUsingId("".concat(trId, "_4_name"));
                newData['size'] = _this.getValueFromInputElemetnUsingId("".concat(trId, "_2_size")),
                    newData['location'] = _this.getValueFromInputElemetnUsingId("".concat(trId, "_3_location"));
                app.acceptEditAnimal(key, idxx, tdId, trId, newData);
            }
            else {
                app.cancelEditAnimal(key, idxx, tdId, trId);
            }
        });
        return button;
    };
    GenerateTableData.prototype.getValueFromInputElemetnUsingId = function (id) {
        var _a;
        return (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value;
    };
    GenerateTableData.prototype.addData = function (key, tdId) {
        var data = this.map.get(key);
        var nameElement = document.getElementById("".concat(tdId, "_name"));
        var sizeElement = document.getElementById("".concat(tdId, "_size"));
        var locationElement = document.getElementById("".concat(tdId, "_location"));
        var name = nameElement.value;
        var size = sizeElement.value === '' ? NaN : sizeElement.value;
        var location = locationElement.value;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var e = data_1[_i];
            if (name === e['name']) {
                alert("".concat(name, " already exist"));
                return;
            }
        }
        if (name === "") {
            alert('name can not be empty');
            return;
        }
        if (location === "") {
            alert('location can not be empty');
            return;
        }
        if (Number.isNaN(size)) {
            alert('Please provide valid size');
            return;
        }
        var tempData = {
            "species": key,
            "name": nameElement.value == "" ? "null" : nameElement.value,
            "size": sizeElement.value == NaN ? -1 : sizeElement.value,
            "location": locationElement.value == "" ? "null" : locationElement.value,
            "image": ""
        };
        nameElement.value = "";
        sizeElement.value = "";
        locationElement.value = "";
        data.push(tempData);
        this.map.set(key, data);
        var tBody = document.getElementById(tdId);
        tBody === null || tBody === void 0 ? void 0 : tBody.innerHTML = "";
        this.generateTableDataRow(key, data, tBody);
    };
    GenerateTableData.prototype.acceptEditData = function (key, idx, tdId, trId, editedData) {
        var data = this.map.get(key);
        data[idx] = editedData;
        this.map.set(key, data);
        var tBody = document.getElementById(tdId);
        tBody === null || tBody === void 0 ? void 0 : tBody.innerHTML = "";
        this.generateTableDataRow(key, data, tBody);
    };
    GenerateTableData.prototype.cancelEditData = function (key, idx, tdId, trId) {
        var data = this.map.get(key);
        var tBody = document.getElementById(tdId);
        tBody === null || tBody === void 0 ? void 0 : tBody.innerHTML = "";
        this.generateTableDataRow(key, data, tBody);
    };
    return GenerateTableData;
}());
var Main = /** @class */ (function () {
    function Main(id) {
        this.app = document.getElementById(id);
        this.MakeData();
    }
    Main.prototype.getData = function (filePath) {
        return new Promise(function (resolve, reject) {
            fetch(filePath).then(function (data) {
                return data.json();
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(new Error("not able get data from ".concat(filePath)));
            });
        });
    };
    Main.prototype.MakeData = function () {
        var _this = this;
        Promise.all([
            this.getData('./data/bigCat.json'),
            this.getData('./data/dogs.json'),
            this.getData('./data/bigFish.json')
        ])
            .then(function (results) {
            _this.generateTableData = new GenerateTableData(results, _this.app);
            _this.generateTableData.generateTables();
        })
            .catch(function (error) {
        });
    };
    Main.prototype.sortTableData = function (tdId, columanName, dataKey) {
        this.generateTableData.sortTable(tdId, columanName, dataKey);
    };
    Main.prototype.deleteAnimal = function (tableName, index, tdId) {
        this.generateTableData.deleteData(tableName, index, tdId);
    };
    Main.prototype.addAnimal = function (key, tdId) {
        this.generateTableData.addData(key, tdId);
    };
    Main.prototype.editAnimal = function (key, idx, tdId, trId) {
        this.generateTableData.editData(key, idx, tdId, trId);
    };
    Main.prototype.acceptEditAnimal = function (key, idx, tdId, trId, newData) {
        this.generateTableData.acceptEditData(key, idx, tdId, trId, newData);
    };
    Main.prototype.cancelEditAnimal = function (key, idx, tdId, trId) {
        this.generateTableData.cancelEditData(key, idx, tdId, trId);
    };
    return Main;
}());
var app = new Main('app');
window.app = app;
