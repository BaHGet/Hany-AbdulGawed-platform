import {useState, Fragment} from 'react';
import {Link} from "react-router-dom";

import arrowUp from '.././photos/arrow-up-filled.png'

import * as CodeAPI from '../../API/CodeAPI'
import * as UserAPI from '../../API/UesrApi'

require('../../utilities/console.js');

const dayjs  = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const LessonContainer = ({ branch, containerName, containerLessons, userCodes, setVideoId }) => {
    const[exist, setExist] = useState([])
    const[inputValue, setInputValue] = useState([])
    
    let hours=96; // time for lectuer to close
    const getIDfromURL = (url)=> {
        /* 
            @param {string} url - Youtube video url
            takes an youtube video url and returns the video ID
            @return {string} videoID
        */
        const videoID = url.split('v=')[1];
        if (videoID !== undefined) {
            return videoID.slice(0, 11);
        }
    }
    const handleVideoIDChange = (e)=>{
        let homework = e.target.dataset.homework || null;
        let notebook = e.target.dataset.notebook || null;
        setVideoId(e.target.id)
        localStorage.setItem("videoId", e.target.id)
        localStorage.setItem("homework", homework)
        localStorage.setItem("notebook", notebook)
    }
    const checkCode = async(code, order)=>{
        let codeexist;
        await containerLessons.map(async(obj) =>{
            if(obj.order ===order ){
                codeexist = await CodeAPI.getSpecific(branch, order, code).then(data => {return(data.codeExist)})
                const newArray = exist.filter(arr => arr[0] !== order)
                newArray.push([order, codeexist])
                setExist(newArray)
                if(codeexist === 1 && order.indexOf('revision') === -1){
                    const deleted = await CodeAPI.UpdataOrderCodes(branch, order, code).then(data => {return(data)});
                    if(!(deleted.message)){
                        await UserAPI.updateAvailableCodes(branch,localStorage.getItem("userEmail"), [order, code])
                        alert(`تم أضافة الكود بنجاح في : ${dayjs().format('D')}/${dayjs().format('MM')} الوقت ${dayjs().format('hh:mm:ss')} \n الكود متاح لثلاث ايام من هذا التاريخ`)
                        window.location.reload();
                    }
                }else{
                    const deleted = await CodeAPI.UpdataOrderCodes(branch, order, code).then(data => {return(data)});
                    if(!(deleted.message)){
                        await UserAPI.updateAvailableCodes(branch, localStorage.getItem("userEmail"), [order, code])
                        alert(` تمت اضافة المرجعة  \n  المراجعة مفتوحة دائما`)
                        window.location.reload();
                    }
                }
            }
        })
    }
    const handleChange = (e) =>{
        let input = e.target.value 
        setInputValue(input)
    }
    const handleSubmit = async(e) =>{
        /* 
            @param {object} e - event object
        */
        let lessonOrder = e.target.id
        await checkCode(inputValue, lessonOrder)
    }
    const millisecondsToDays = (diff) =>{
        /* 
            @param {number} diff - difference between two dates in milliseconds
            Format a date as 'X days, Y hours, Z minutes'
            @return {string} formatted date 
        */
        const milliSecondsInDay = 24 * 60 * 60 * 1000;
        const milliSecondsInHour = 60 * 60 * 1000;
        const zeroAnnotation  = function(n){ return n < 10 ? '0' + n : n; };
        let days = Math.floor(diff / milliSecondsInDay);
        let hours = Math.floor( (diff - days * milliSecondsInDay) / milliSecondsInHour);
        let minutes = Math.round( (diff - days * milliSecondsInDay - hours * milliSecondsInHour) / 60000);
        
        if( minutes === 60 ){
            hours++;
            minutes = 0;
        }
        if( hours === 24 ){
            days++;
            hours = 0;
        }
        return [`${days} days`, `${zeroAnnotation(hours)} hours`, `${zeroAnnotation(minutes)} minutes`].join(', ');
    }
    const handleDateChange = (userCodes, order) => {
        if(userCodes.filter(obj => obj.order === order)[0].date !== 'Open'){
            let date = dayjs(userCodes.filter(obj => obj.order === order)[0].date);
            let dataOfClose = dayjs(date.add(hours, 'h')) ;
            let diff = (dataOfClose).diff(dayjs().format())
            return [diff, millisecondsToDays(diff)];
        }else{
            return['Open', 'Open']
        }  
    }

    return (
        <div className="lessons-box">
            <h1 className="title"
                style={{textAlign:'right', marginRight: '2%'}}
            >:{containerName}</h1>
            {containerLessons.map((lesson,num) =>{
                if(userCodes){  
                    if(userCodes.filter(obj => obj.order === lesson.order).length === 1){
                        let diff = handleDateChange(userCodes, lesson.order)[0]
                        let finalDate =  handleDateChange(userCodes, lesson.order)[1];
                        
                        return(
                            (diff < 345600000  && diff > 0) || finalDate === 'Open' ? 
                                <div key={'lesson'+num} className="lesson">
                                    <div className='lesson-title'>
                                        <h1 className="lecture-name">{lesson.name}</h1>
                                        <img className="arrow-div" src={arrowUp} alt="arrow-up"/>
                                        <h4 
                                            style={{margin:'0 0 0 3%', textAlign:'left', width: 'fit-content'}}
                                        >
                                            {finalDate !== 'Open' ? 
                                                
                                                <>
                                                    :الوقت المتبقي للمحاضر<br/>
                                                    {finalDate}
                                                </>
                                            
                                            :
                                                ('Always Open')
                                        }
                                        </h4>
                                    </div>
                                    <ul className='lesson-parts'>
                                        {lesson.parts.map((part,num)=>{
                                            if(part.lessonName.search('مسائل الملزمة') === -1){
                                                return(
                                                <li key={'partObject'+num}>
                                                    <ul className='lesson-part'>
                                                        <li key={'partName'+num}>
                                                        {part.lessonName}
                                                        </li>
                                                        <li key={'partState'+num} >
                                                            <Link className='play-btn' id={getIDfromURL(part.link)} data-notebook={part.attachments.notebook || null} data-homework={part.attachments.homework || null} onClick={handleVideoIDChange} to={'/Hany-AbdulGawed-platform/lessonView'} >  مشاهدة    </Link>
                                                            <button id={getIDfromURL(part.link)} className='lesson-btn' style={{color:'#4bd84b',fontWeight:'bold'}}>  مفتوحة</button>
                                                        </li>
                                                        <li key={part.duration}>
                                                            {part.duration}
                                                        </li>
                                                    </ul>
                                                </li>
                                                ); 
                                            }else{
                                                return(
                                                    part.link !== 'soon' ? 
                                                        <li key={'partObject'+num}>
                                                            <ul className='lesson-part'>
                                                                <li key={'partName'+num}>
                                                                    {part.lessonName}
                                                                </li>
                                                                <li key={'partLink'+num}>
                                                                    <a target='_blank' rel="noreferrer"  style={{textDecoration: 'none'}} href={part.link}>القائمة</a>
                                                                </li>
                                                                </ul>
                                                        </li>
                                                    :
                                                        <li key={'partObject'+num}>
                                                            <ul className='lesson-part'>
                                                                <li key={'partName'+num}>{part.lessonName}</li>
                                                                <li
                                                                    style={{color:'#64ec64',fontWeight:'bold'}}
                                                                    key={'duration'+num}>
                                                                    ستتوفر قريبا
                                                                </li>
                                                            </ul>
                                                        </li>
                                                );
                                            }
                                        })}
                                    {
                                    lesson.exams.map(Exam =>{
                                        return(
                                            Exam.link ?
                                                <li key={'examObject'+num}>
                                                    <ul className='lesson-part'>
                                                        <li key={'examName'+num}>
                                                            {Exam.name }
                                                        </li>
                                                        <li key={'examLink'+num}>
                                                            <a target='_blank' rel="noreferrer" style={{textDecoration: 'none'}} href={Exam.link}>الاختبار</a>
                                                        </li>
                                                    </ul>
                                                </li>     
                                                :
                                                ''
                                        )
                                    })
                                    }
                                    </ul>
                                </div>
                            :
                                <div key={'lesson'+num} className="lesson">
                                    <div className='lesson-title'>
                                        <h1 className="lecture-name">{lesson.name}</h1>
                                        <img className="arrow-div" src={arrowUp} alt="arrow-up"/>
                                        <h4 
                                            style={{margin:'0 0 0 3%', textAlign:'left', width: 'fit-content'}}
                                        >
                                            {'المحاضرة مغلقة'}
                                        </h4>
                                    </div>
                                    <ul className='lesson-parts'>
                                        {
                                            lesson.parts.map((part,num)=>{
                                                return(
                                                    part.lessonName.search('مسائل الملزمة') !== -1 &&
                                                    <li key={'partObject'+num}>
                                                        <ul className='lesson-part'>
                                                            <li key={'partName'+num}>
                                                                {part.lessonName}
                                                            </li>
                                                            <li key={'partLink'+num}>
                                                                <a target='_blank' rel="noreferrer"  style={{textDecoration: 'none'}} href={part.link}>القائمة</a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                )
                                            })
                                            &&
                                            lesson.exams.map(Exam =>{
                                                return(
                                                    Exam.link &&
                                                    <li key={'examObject'+num}>
                                                        <ul className='lesson-part'>
                                                            <li key={'examName'+num}>
                                                                {Exam.name }
                                                            </li>
                                                            <li key={'examLink'+num}>
                                                                <a target='_blank' rel="noreferrer" style={{textDecoration: 'none'}} href={Exam.link}>الاختبار</a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                        )
                    }else{
                        return(
                            <Fragment key={'lesson-fragment'+num}>
                                <div key={'lesson'+num} className="lesson">
                                    <div className='lesson-title'>
                                        <h1 className="lecture-name">{lesson.name}</h1>
                                        <li id={'form'+lesson.order} key={'partInput'+num}>
                                            <form  onSubmit={e => e.preventDefault()}>
                                                <input
                                                    id={lesson.order}
                                                    className='input-field'
                                                    type="text"
                                                    placehorder="Input code(case sensitive!)"
                                                    onChange={handleChange}
                                                    max='10'
                                                />
                                                {
                                                inputValue.length !== 0 &&
                                                <button id={lesson.order} onClick={handleSubmit} style={{backgroundColor:'white',color:'black',fontWeight:'bold'}} >Check</button>
                                                }
                                            </form>
                                        </li>
                                        {exist.map((ele, num) =>{
                                                return(
                                                    ele[0] === lesson.order && (
                                                        ele[1] === 0 &&
                                                        <li id='wrong'
                                                            style={{color:'rgb(99, 2, 2)',fontWeight:'bold', listStyleType: 'none', marginRight:'8vw'}}
                                                            key={'duration'+num}>
                                                            كود غير صحيح
                                                        </li>
                                                    )
                                                )
                                            })}
                                        <img className="arrow-div" src={arrowUp} alt="arrow-up"/>
                                    </div>
                                </div>
                                {
                                lesson.order.search('revision') === -1 &&
                                <ul key={'lesson-parts'+num} className='lesson-parts'>
                                    {lesson.parts.map((part,num)=>{
                                        if(part.lessonName.search('مسائل الملزمة') !== -1){
                                            return(
                                                <li key={'partObject'+num}>
                                                    <ul className='lesson-part'>
                                                        <li key={'partName'+num}>
                                                            {part.lessonName}
                                                        </li>
                                                        <li key={'partLink'+num}>
                                                            <a target='_blank' rel="noreferrer"  style={{textDecoration: 'none'}} href={part.link}>القائمة</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            )
                                        }
                                        else{
                                            return(
                                                <li key={'partObject'+num}>
                                                    <ul className='lesson-part'>
                                                        <li key={'partName'+num}>
                                                            {part.lessonName}
                                                        </li>
                                                        <li key={'partLink'+num}>
                                                            <a target='_blank' rel="noreferrer"  style={{textDecoration: 'none'}} href={part.link}>القائمة</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            )
                                        }
                                    })}
                                    
                                    {
                                        lesson.exams.map(Exam =>{
                                            return(
                                                Exam.link ?
                                                    <li key={'examObject'+num}>
                                                        <ul className='lesson-part'>
                                                            <li key={'examName'+num}>
                                                                {Exam.name }
                                                            </li>
                                                            <li key={'examLink'+num}>
                                                                <a target='_blank' rel="noreferrer" style={{textDecoration: 'none'}} href={Exam.link}>الاختبار</a>
                                                            </li>
                                                        </ul>
                                                    </li>     
                                                    :
                                                    ''
                                            )
                                        })
                                    }
                                </ul>
                                }
                            </Fragment>
                        )
                    }
                }else{
                    return(
                        <Fragment key={'lesson-fragment'+num}>
                            <div key={'lesson'+num} className="lesson">
                                <div className='lesson-title'>
                                    <h1 className="lecture-name">{lesson.name}</h1>
                                    <li id={'form'+lesson.order} key={'partInput'+num}>
                                        <form  onSubmit={e => e.preventDefault()}>
                                            <input
                                                id={lesson.order}
                                                className='input-field'
                                                type="text"
                                                placehorder="Input code(case sensitive!)"
                                                onChange={handleChange}
                                                max='10'
                                            />
                                            {
                                            inputValue.length !== 0 &&
                                            <button id={lesson.order} onClick={handleSubmit} style={{backgroundColor:'white',color:'black',fontWeight:'bold'}} >Check</button>
                                            }
                                        </form>
                                    </li>
                                    {exist.map((ele, num) =>{
                                            return(
                                                ele[0] === lesson.order && (
                                                    ele[1] === 0 &&
                                                    <li id='wrong'
                                                        style={{color:'rgb(99, 2, 2)',fontWeight:'bold', listStyleType: 'none', marginRight:'8vw'}}
                                                        key={'duration'+num}>
                                                        كود غير صحيح
                                                    </li>
                                                )
                                            )
                                        })}
                                    <img className="arrow-div" src={arrowUp} alt="arrow-up"/>
                                </div>
                            </div>
                            {
                            lesson.order.search('revision') === -1 &&
                            <ul key={'lesson-parts'+num} className='lesson-parts'>
                                {lesson.parts.map((part,num)=>{
                                    if(part.lessonName.search('مسائل الملزمة') !== -1){
                                        return(
                                            <li key={'partObject'+num}>
                                                <ul className='lesson-part'>
                                                    <li key={'partName'+num}>
                                                        {part.lessonName}
                                                    </li>
                                                    <li key={'partLink'+num}>
                                                        <a target='_blank' rel="noreferrer"  style={{textDecoration: 'none'}} href={part.link}>القائمة</a>
                                                    </li>
                                                </ul>
                                            </li>
                                        )
                                    }
                                    else{
                                        return(
                                            <li key={'partObject'+num}>
                                                <ul className='lesson-part'>
                                                    <li key={'partName'+num}>
                                                        {part.lessonName}
                                                    </li>
                                                    <li key={'partLink'+num}>
                                                        <a target='_blank' rel="noreferrer"  style={{textDecoration: 'none'}} href={part.link}>القائمة</a>
                                                    </li>
                                                </ul>
                                            </li>
                                        )
                                    }
                                })}
                                
                                {
                                    lesson.exams.map(Exam =>{
                                        return(
                                            Exam.link ?
                                                <li key={'examObject'+num}>
                                                    <ul className='lesson-part'>
                                                        <li key={'examName'+num}>
                                                            {Exam.name }
                                                        </li>
                                                        <li key={'examLink'+num}>
                                                            <a target='_blank' rel="noreferrer" style={{textDecoration: 'none'}} href={Exam.link}>الاختبار</a>
                                                        </li>
                                                    </ul>
                                                </li>     
                                                :
                                                ''
                                        )
                                    })
                                }
                            </ul>
                            }
                        </Fragment>
                    )
                }
            })}
        </div>
    )
}

export default LessonContainer