// caculation module

var budgetConroller = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expence = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var data = {
        allItem: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0

        },
        budget: 0,
        percentage: -1

    }


    var calculateTotal = function (type) {

        var total = 0;

        data.allItem[type].forEach(function (current) {
            total = total + current.value;
        });
        data.totals[type] = total;

    }

    return {

        addItem: function (type, des, val) {

            var newItem, ID;

            //creat new id
            if (data.allItem[type].length > 0) {
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            //creat new item based on 'inc' or 'exp'
            if (type === 'exp') {
                newItem = new Expence(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //push it into datastructure
            data.allItem[type].push(newItem);

            //return the new eliment
            return newItem;

        },


        deleteItem: function (type, id) {

            var ids = data.allItem[type].map(function (current) {
                return current.id;
            });



            var index = ids.indexOf(id);
            // console.log(index);
            if (index !== -1) {
                data.allItem[type].splice(index, 1);
            }

        },


        calculateBudget: function () {
            //calculate total income an dexpences

            calculateTotal('exp');
            calculateTotal('inc');

            //clculate the budget

            data.budget = data.totals['inc'] - data.totals['exp'];


            //calculate percentage
            if (data.totals['exp'] === 0) {
                data.percentage = 0;
            } else {
                data.percentage = Math.round((data.totals['exp'] / data.totals['inc']) * 100);
            }
        },



        itemPer: function (id) {

            var per, ids, index;

            ids = data.allItem['exp'].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);
            if (data.budget === 0) {

                per = 0;

            } else {

                per = Math.round((data.allItem['exp'][index].value / data.budget) * 100);
            }


            return per;


        },



        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals['inc'],
                totalExp: data.totals['exp'],
                percentage: data.percentage
            };
        },
        testing: function () {
            return data;
        }




    }



})();

//UI module
var UIcontroller = (function () {

    var DOMstrings = {
        inputType: '.sign',
        inputDescription: '.description',
        inputValue: '.value',
        inputBtn: '.check',
        inputIncome: '.incomeList',
        inputItem: '.item',
        inputExpence: '.expencesList',
        inputPercentage: '.itemPercentage',
        showbudget: '.budget',
        showIncomeTotal: '.incomeNumber',
        showExpenceTotal: '.expencesNumber',
        showExpencePercentage: '.percentage',
        container: '.container',
        inputMonth: '.month',
        inputYear: '.year'
    };



    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // + or -
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };


        },

        addListItem: function (obj, type, percentage) {

            //selecting full list
            var listIncome = document.querySelector(DOMstrings.inputIncome);
            var listExpences = document.querySelector(DOMstrings.inputExpence);


            // creating all the elements
            var item = document.createElement('li');
            var itemDes = document.createElement('span');
            var itemValue = document.createElement('span');
            var itemPer = document.createElement('span');
            var deleteButton = document.createElement('button');

            //declearing their class names
            item.className = 'item ';
            itemDes.className = 'itemName';
            itemPer.className = 'itemPercentage';
            itemValue.className = 'itemValue ';
            deleteButton.className = 'remove ';



            //adding value

            itemDes.textContent = obj.description;

            deleteButton.innerHTML = '<i class="fas fa-times-circle" id="icon"></i>';


            //adding and cheching if they are inc or exp

            item.appendChild(itemDes);
            item.appendChild(itemValue);



            if (type === 'inc') {


                item.classList.add('incomeItem');
                deleteButton.classList.add('removeIncome');
                itemValue.textContent = `+ ${obj.value}`;
                item.appendChild(deleteButton);
                item.id = `inc-${obj.id}`;
                listIncome.appendChild(item);
                // list.appendChild(item);



            } else if (type === 'exp') {

                item.classList.add('expencesItem');
                itemValue.textContent = `- ${obj.value}`
                itemPer.innerHTML = `${percentage}%`;
                item.appendChild(itemPer);
                deleteButton.classList.add('removeExpences');
                item.appendChild(deleteButton);

                item.id = `exp-${obj.id}`;
                listExpences.appendChild(item);




            }

        },



        clearInputs: function () {

            document.querySelector(DOMstrings.inputDescription).value = '';
            document.querySelector(DOMstrings.inputValue).value = '';
            document.querySelector(DOMstrings.inputDescription).focus();





        },
        displayBudget: function (obj) {

            document.querySelector(DOMstrings.showbudget).innerHTML = `${obj.budget}`;
            document.querySelector(DOMstrings.showIncomeTotal).innerHTML = `${obj.totalInc}`;
            document.querySelector(DOMstrings.showExpenceTotal).innerHTML = `${obj.totalExp}`;
            document.querySelector(DOMstrings.showExpencePercentage).innerHTML = `${obj.percentage}%`;

        },


        // optionSelection: function (color) {

        //     document.querySelector('.sign').style.borderColor = color.className;
        // },

        removeItem: function (e) {
            if (e.target.parentElement.classList.contains('remove')) {
                e.target.parentElement.parentElement.remove();
            }
        },


        updateDate: function () {

            var date = new Date();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            document.querySelector(DOMstrings.inputMonth).innerHTML = months[date.getMonth()];
            document.querySelector(DOMstrings.inputYear).innerHTML = ` ${date.getFullYear()}:`;


        },
        changeColor: function () {

            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }


            }
            var field = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(field, function (cur) {
                cur.classList.toggle('red_focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');


        },




        getDOMstrings: function () {

            return DOMstrings;

        }

    }
})();




//App controller
var controller = (function (budgetCltr, UICltr) {
    var DOM = UICltr.getDOMstrings();
    //event listeners function
    function setEventListeners() {





        // veriables
        var checkButton = document.querySelector(DOM.inputBtn);








        //event listeners


        checkButton.addEventListener('click', ctrlAddItem);

        document.body.addEventListener('keypress', function (e) {
            if (e.keyCode == 13) {
                ctrlAddItem();

            }

        });
        //delete element from UI(2)

        document.querySelector('.bottom').addEventListener('click', ctrlDeleteItem);
        document.querySelector('.sign').addEventListener('change', UICltr.changeColor);

        //date object

        UICltr.updateDate();


    };



    var updateBudget = function () {


        budgetCltr.calculateBudget();

        var budget = budgetCltr.getBudget();

        UICltr.displayBudget(budget);




    }









    //add list item function 
    function ctrlAddItem() {



        var input = UICltr.getInput();


        if (input.description === "" || isNaN(input.value)) {
            alert('Please input something');
        }
        else {


            var newItem = budgetCltr.addItem(input.type, input.description, input.value);


            if (input.type === 'exp') {
                var percentage = budgetCltr.itemPer(newItem.id);


                UICltr.addListItem(newItem, input.type, percentage);
            }
            else {
                var percentage = 0;

                UICltr.addListItem(newItem, input.type, percentage);
            }

            UICltr.clearInputs();
            updateBudget();
        }


    }




    // UICltr.optionSelection();

    function ctrlDeleteItem(e) {

        var itemId = e.target.parentElement.parentElement.id;

        if (itemId) {
            var splitId = itemId.split('-');

            var type = splitId[0];
            var id = parseInt(splitId[1]);



        }
        budgetCltr.deleteItem(type, id);
        UICltr.removeItem(e);
        updateBudget();

    }



    // initalize function
    return {
        init: function () {
            var DOM = UICltr.getDOMstrings();
            document.querySelector(DOM.showbudget).innerHTML = `0`;
            document.querySelector(DOM.showIncomeTotal).innerHTML = `0`;
            document.querySelector(DOM.showExpenceTotal).innerHTML = `0`;
            document.querySelector(DOM.showExpencePercentage).innerHTML = `0%`;
            setEventListeners();
        },

        //testing function to test this module
        testing: function () {
            ctrlAddItem();
        }
    }



})(budgetConroller, UIcontroller);

controller.init();

