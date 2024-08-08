const inquirer = require('inquirer');

module.exports = async function startPrompt() {
    var exit = false;
    const myChoices = [
        'Exit Employee Manager',
        'View All Employees',
        'Add Employees',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Department',
        'Add Department',
        'View Employee By Department',
        'View Employee By Manager',
        'Update Employee Manager',
        'Delete Department(s)',
        'Delete Role(s)',
        'Delete Employee(s)',
        'View Total Utilized Budget Of A Department'
    ]

    while(!exit){
        await inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'selection',
            choices: myChoices
        })
        .then((answer) => {
            switch (answer.selection) {
                case myChoices[1]:
                    //code here
                    break;
                case myChoices[2]:
                    //code here
                    break;
                case myChoices[3]:
                    //code here
                    break;
                case myChoices[4]:
                    //code here
                    break;                    
                case myChoices[5]:
                    //code here
                    break;
                case myChoices[6]:
                    //code here
                    break;
                case myChoices[7]:
                    //code here
                    break;
                case myChoices[8]:
                    //code here
                    break;
                case myChoices[9]:
                    //code here
                    break;
                case myChoices[10]:
                    //code here
                    break;                    
                case myChoices[11]:
                    //code here
                    break;
                case myChoices[12]:
                    //code here
                    break;
                case myChoices[13]:
                    //code here
                    break;
                case myChoices[14]:
                    //code here
                    break;
                default:
                    console.log('Thank you for using Employee-Manager, have a great day!');
                    exit = true;
                    process.exit()
            }
        })
    }

}