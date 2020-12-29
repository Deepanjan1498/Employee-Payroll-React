import React, { useEffect, useState} from 'react';
import './payroll-form.css';
import logo from '../payroll-form/assets/images/logo.png';
import p from '../payroll-form/assets/profile-images/Ellipse -1.png';
import p1 from '../payroll-form/assets/profile-images/Ellipse -3.png';
import p2 from '../payroll-form/assets/profile-images/Ellipse -7.png';
import p3  from '../payroll-form/assets/profile-images/Ellipse 1.png'
import { useParams,Link,withRouter } from 'react-router-dom';
import EmployeeService from "../../services/employee-service";

const PayrollForm = (props) => {
    let initialValue = {
        name: '',
        profileArray: [
            {url: '../payroll-form/assets/images/logo.png'},
            {url: '../payroll-form/assets/profile-images/Ellipse -1.png'},
            {url: '../payroll-form/assets/profile-images/Ellipse -3.png'},
            {url: '../payroll-form/assets/profile-images/Ellipse -7.png'},
            {url: '../payroll-form/assets/profile-images/Ellipse 1.png' }
        ],
        departMentValue: [
            {"department":'HR',"id":1, isChecked:false},{ "department":'Sales',"id":2, isChecked:false}, {"department":'Engineer',"id":3, isChecked:false},
            {"department":'Finance',"id":4, isChecked:false},{"department":'Others',"id":5, isChecked:false}
        ],
        gender: '',
        salary: '50000',
        Day: '1',
        Month: 'Jan',
        Year: '2020',
        startDate: '',
        notes: '',
        //id: '',
        profileUrl: '',
        isUpdate: false,
        error: {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profileUrl: '',
            startDate: ''
    }
}
const [formValue, setForm] = useState(initialValue);
const [errorValue,setError]= useState([]);
const params = useParams();
console.log(formValue.departMentValue)
const employeeService = new EmployeeService();   
useEffect(() => {
    setError({
        nameerror:"",
        startDateerror:"",
            })
     getDataById(params.id);
  },[]
  );

  const getDataById = (id) => {
    employeeService
      .getEmployee(id)
      .then((data) => {
        console.log("data is ", data.data.obj);
        let obj = data.data.obj;
        obj.department.map(empDept =>{
            initialValue.departMentValue.map(dept => {
            if(dept.department === empDept.department){
            dept.isChecked = true;
            }
            })
            })
            setData(obj);
      })
      .catch((err) => {
        console.log("err is ", err);
      });
  };
const setData = (obj) => {
    let array = obj.startDate.split(" ");
    console.log(obj)
    setForm({
      ...formValue,
      ...obj,
      name : obj.name,
      gender:obj.gender,
      salary: obj.salary,
      profileUrl: obj.profile,
      departMentValue: initialValue.departMentValue,
      notes: obj.notes,
      isUpdate: true,
      Day: array[0],
     Month: array[1],
     Year: array[2],
   });
  };

   const changeDepartmentHandler = (event) => {
    let checkedDepartment = [...formValue.departMentValue]
    console.log(checkedDepartment)
     let index = formValue.departMentValue.findIndex(dept => dept.department == event.target.name)
        checkedDepartment[index] = {...checkedDepartment[index],isChecked:!checkedDepartment[index].isChecked}
        setForm({ ...formValue, departMentValue: checkedDepartment });
    }

    const nameRegex = RegExp("^[A-Z]{1}[a-zA-Z\\s]{2,}[A-Za-z\s]{0,}$");
    const handleNameChange=(event) =>{
            
        setForm({...formValue,name: event.target.value});
        if(nameRegex.test(event.target.value)){
            
            setError({...errorValue,nameerror: ""});
          }else{
            setError({...errorValue,nameerror: "Name should start with captal letter"});
            
          }
          console.log({formValue})
          console.log({errorValue})
}

    const changeValue = (event) => {
    console.log(event.target.name+"=="+event.target.value);
        setForm({ ...formValue, [event.target.name]: event.target.value })
    }
    
    const validData = async () => {
        let isError = false;
        let error = {
            department: '',
            name: '',
            gender: '',
            salary: '',
            profileUrl: '',
            startDate: ''
        }
        
        if (formValue.gender.length < 1) {
            error.gender = 'Select your gender'
            isError = true;
        }
        if (formValue.departMentValue.filter(dept=> (dept.isChecked==true)).length==0) {
            error.department = 'Select atleast one department'
            isError = true;
        }
        let enteredDate = new Date(formValue.Day+ " " + formValue.Month + " " + formValue.Year)
        let currentDate = new Date();
        let dateDifference = Math.ceil((currentDate-enteredDate))/(1000*60*60*24);
        let currentDateFormat = currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getFullYear();
        let priorDate = new Date(); 
        priorDate.setDate(priorDate.getDate() - 30);
        let priorDateFormat = priorDate.getDate() + "-" + (priorDate.getMonth()+1) + "-" + priorDate.getFullYear();

        if( dateDifference > 30){
            error.startDate = "Date should be between " + priorDateFormat + " and " + currentDateFormat;
            isError = true;
        }
        if( dateDifference < 0){
            error.startDate = "Date can not exceed present date."
            isError = true;
        }
        await setForm({ ...formValue, error: error })
        return isError;
    }

    const save = async (event) => {
        let result = window.confirm("Add/Update new employee?")
        if (result){
        event.preventDefault();
        if(await validData()){
            console.log("error", formValue);
            return;
        }
        let ucdepartment = []; 
        formValue.departMentValue.filter(dept =>{
            if(dept.isChecked==true){
        ucdepartment.push({"id":dept.id, "department":dept.department});
            }})
        

        
        let object = {
            name: formValue.name,
            department: ucdepartment,
            gender: formValue.gender,
            salary: formValue.salary,
            startDate: `${formValue.Day} ${formValue.Month} ${formValue.Year}`,
            notes: formValue.notes,
            id: formValue.id,
            profile: formValue.profileUrl,
        };

        console.log(object);
           object.id = params.id
          if (formValue.isUpdate) {
            console.log(object);
            employeeService
              .updateEmployee(object)
              .then((data) => {
                console.log("data after update", data);

                props.history.push("");
              })
              .catch((err) => {
                console.log("Error after update");
              });
          } else {
              console.log(object)
            employeeService
              .addEmployee(object)
              .then((data) => {
                console.log("Employee payroll added");
                props.history.push("");
              })
              .catch((err) => {
                console.log("error occured while adding employee");
              });
          }
        }
        else{
            window.location.reload();
        }
          };
        
    const reset = () => {
        setForm({ ...initialValue, id: formValue.id, isUpdate: formValue.isUpdate });
        console.log(formValue);
    }
   
    return(
        <div>
      <header className = "header-content header">
            <div className = "logo-content">
            <img src ={logo} alt ="Logo" />
                <div>
                    <span className = "emp-text">EMPLOYEE</span><br/>
                    <span className = "emp-text emp-payroll">PAYROLL</span>
                </div>
            </div>
        </header>
        <div className = "payroll-main">
        <div className ="form-content" id = "formId">
        <form className = "form" action = "#" onReset = "resetForm()" onSubmit = {save}>
        <div className="form-head">Employee Payroll Form </div>
            <div className="row-content">
            <label className="label text" htmlFor ="name">Name:</label>
            <input className="input" type="text" id="name" name="name" value={formValue.name} onChange={handleNameChange} placeholder="Enter name here" required/>
            </div><div className="error">{errorValue.nameerror}</div> 
        
        
        <div className = "row-content">
                    <label className = "label text" htmlFor = "profile">Profile Image:</label>
                    <div className = "profile-radio-content">
                        <label>
                            <input type = "radio" checked={formValue.profileUrl==='../assets/profile-images/Ellipse -1.png'} name = "profileUrl"
                                   value ="../assets/profile-images/Ellipse -1.png" onChange={changeValue} required />
                            <img className = "profile" src={p} alt="" />
                        </label>
                        <label>
                            <input type = "radio" checked={formValue.profileUrl==='../assets/profile-images/Ellipse -3.png'} name = "profileUrl"
                                   value ="../assets/profile-images/Ellipse -3.png" onChange={changeValue} required />
                            <img className = "profile" src={p1} alt="" />
                        </label>
                        <label>
                            <input type = "radio" checked={formValue.profileUrl==='../assets/profile-images/Ellipse -7.png'} name = "profileUrl"
                                   value ="../assets/profile-images/Ellipse -7.png" onChange={changeValue} required />
                            <img className = "profile" src = {p2} alt=""/>
                        </label>
                        <label>
                            <input type = "radio" checked={formValue.profileUrl==='../assets/profile-images/Ellipse 1.png'} name = "profileUrl"
                                   value ="../assets/profile-images/Ellipse 1.png" onChange={changeValue} required />
                            <img className = "profile" src = {p3} alt=""/>
                        </label>
                    </div>
                </div>
                <div className="error">{formValue.error.profileUrl}</div>
                <div className = "row-content">
                    <label className = "label text" htmlFor = "gender">Gender:</label>
                    <div>
                        <input type = "radio" checked ={formValue.gender==='male'} id = "male" onChange={changeValue} name = "gender" value = "male" />
                        <label className = "text" htmlFor = "male">Male</label>
                        <input type = "radio" checked ={formValue.gender==='female'} id = "female" onChange={changeValue} name = "gender" value = "female" />
                        <label className = "text" htmlFor = "female">Female</label>                       
                    </div>
                </div>
                <div className="error">{formValue.error.gender}</div>
                <div className = "row-content">
                    <label className = "label text" htmlFor = "department">Department:</label>
                    {
                            formValue.departMentValue.map(dept =>
                                
                                <div>
                                    {console.log(dept)}
                                    <input className="checkbox" type="checkbox"  name={dept.department} checked={dept.isChecked} value={dept.department} onChange={changeDepartmentHandler}/>
                                <label class="text" htmlFor={dept.department}>{dept.department}</label>
                                </div>)
                        }
                </div>
                <div className="error">{formValue.error.department}</div>
                <div className = "row-content">
                <label className="label text" htmlFor="salary">Salary:</label>
                        <input className="slider" type="range" onChange={changeValue} id="salary" value={formValue.salary} name="salary" placeholder="Salary"
                        min="1000" max="100000" step="100"/>
                        <output className="salary-output text" htmlFor="salary">{formValue.salary}</output>
                    </div>
                    <div className="error" > {formValue.error.salary} </div>

                <div className = "row-content">
                    <label className = "label text" htmlFor = "startDate">Start Date:</label>
                      <div id = "date">
                        <select value={formValue.Day} onChange={changeValue} id = "Day" name ="Day">
                            <option value = "1">1</option>
                            <option value = "2">2</option>
                            <option value = "3">3</option>
                            <option value = "4">4</option>
                            <option value = "5">5</option>
                            <option value = "6">6</option>
                            <option value = "7">7</option>
                            <option value = "8">8</option>
                            <option value = "9">9</option>
                            <option value = "10">10</option>
                            <option value = "11">11</option>
                            <option value = "12">12</option>
                            <option value = "13">13</option>
                            <option value = "14">14</option>
                            <option value = "15">15</option>
                            <option value = "16">16</option>
                            <option value = "17">17</option>
                            <option value = "18">18</option>
                            <option value = "19">19</option>
                            <option value = "20">20</option>
                            <option value = "21">21</option>
                            <option value = "22">22</option>
                            <option value = "23">23</option>
                            <option value = "24">24</option>
                            <option value = "25">25</option>
                            <option value = "26">26</option>
                            <option value = "27">27</option>
                            <option value = "28">28</option>
                            <option value = "29">29</option>
                            <option value = "30">30</option>
                            <option value = "31">31</option>
                        </select>
                        <select  value={formValue.Month} onChange={changeValue} id = "Month" name = "Month">
                            <option value = "Jan">January</option>
                            <option value = "Feb">February</option>
                            <option value = "March">March</option>
                            <option value = "April">April</option>
                            <option value = "May">May</option>
                            <option value = "June">June</option>
                            <option value = "July">July</option>
                            <option value = "Aug">August</option>
                            <option value = "Sept">September</option>
                            <option value = "Oct">October</option>
                            <option value = "Nov">November</option>
                            <option value = "Dec">December</option>
                        </select>
                        <select value={formValue.Year} onChange={changeValue} id = "Year" name = "Year">
                            <option value = "2020">2020</option>
                            <option value = "2019">2019</option>
                            <option value = "2018">2018</option>
                            <option value = "2017">2017</option>
                            <option value = "2016">2016</option>
                        </select>
                    </div>
                    </div>
                    <div className="error">{formValue.error.startDate}</div>
                
                
                <div className = "row-content">
                    <label className = "label text" htmlFor = "notes">Notes:</label>
                    <textarea className = "input" onChange={changeValue} id = "notes" value={formValue.notes} name = "notes"
                              placeholder = "" ></textarea>
                </div>
                <div className="buttonParent">
                            <Link to="" className="resetButton button cancelButton">Cancel</Link>
                            <div className="submit-reset">
                                <button type="submit" className="button submitButton" id="submitButton">{formValue.isUpdate ? 'Update' : 'Submit'}</button>
                                <button type="reset" onClick={reset} className="resetButton button">Reset</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        );
    }



export default withRouter(PayrollForm);