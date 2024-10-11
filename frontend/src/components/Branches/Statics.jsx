import LoginBtn from '../Essential/login'
import { useLessonsAPI } from '../../hooks/useLessonsAPI';
import LessonContainer from '../Essential/lessonContainer';

require('../../utilities/console.js');

const Statics = ({setVideoId, user, userPayingSystem, userCodes}) =>{
    const Staticslesson = useLessonsAPI('statics') || []
    // Branch Name
    let branch = 'Statics'

    if(user === null){
        return (
            <h1 style={{textAlign:'center', marginTop:'200px'}}>
                يرجي تسجيل الدخول
                <br />
                <LoginBtn/>
            </h1>
        )
    }
    if(
        userPayingSystem === null || userPayingSystem === 'none' ||
        localStorage.getItem("userPayingSystem") === 'none'|| userPayingSystem === 'LPS' ||
        localStorage.getItem("userPayingSystem") === 'LPS' || userPayingSystem === 'MPS' ||
        localStorage.getItem("userPayingSystem") === 'MPS'
    ){
        return(
            <LessonContainer branch={branch} containerName="أستاتيكا" containerLessons={Staticslesson} setVideoId={setVideoId} userCodes={userCodes}/>
        );
    }
    if(localStorage.getItem("userPayingSystem") === 'null' || localStorage.getItem("userPayingSystem") === 'none'){
        return (<h1 style={{textAlign:'center', marginTop:'200px'}}>
            نظام الاشتراك غير محدد
            <br/>
            يرجي اعادة تحميل الصفحة او تحديد نظام الاشتراك
        </h1>)
    }
}
export default Statics;