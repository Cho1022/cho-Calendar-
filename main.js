function prevMonth(date) { //이전 달을 구하는 함수
    let target = new Date(date); //date를 복사
    target.setDate(1);
    target.setMonth(target.getMonth() - 1); // getMonth()현재 달에서 1을 뺀다는 것은 이전달을 의미.
    return getYmd(target); //년월일을 가져온다.
}
function nextMonth(date){
    let target = new Date(date);
    target.setDate(1);
    target.setMonth(target.getMonth() + 1)
    return getYmd(target)
}
function getYmd(date){
    let month = ('0' + (date.getMonth() + 1)).slice(-2); //01,02..이렇게 표현해서 12월 만들기+ slice는 뒤에서두개만 가져오기,예:010->10
    return [date.getFullYear(), month, '01'].join('-');
}
function fullDays(date) {
    let target = new Date(date); //date를 복사
    let year = target.getFullYear();
    let month = target.getMonth();

    let firstWeekDay = new Date(year, month, 1).getDay(); //첫째날의 요일
    let thisDays = new Date(year, month + 1, 0).getDate(); //day는 1부터 시작하므로 0을 넣어서 전달의 마지막 날을 구하기.            

    let slot = [28, 35, 42].filter(n => n >= (firstWeekDay + thisDays)).shift(); //달마다 있을 수 있는 요일 경우의 수는 3가지 중 하나 fWD=첫번째 일수   
    let days = []
    for(let i = 0; i < slot; i++){
        days[i] ={
            date: '',
            dayNum:'',
            today: false
        };
    }

    let now = new Date(date); //오늘 날짜
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //오늘 날짜의 년,월,일
    let inDate; //날짜를 담을 변수
    for(let index =0 , i =1; i<= thisDays; index++, i++){
        inDate = new Date(year, month, i);
        days[index + firstWeekDay] = {
            date: i,
        dayNum: inDate.getDay(),
        today: (inDate.getTime() ===today.getTime())
        };

    }
    return days;
} 
function drawMonth(date) {
    document.getElementById('month-this').innerText = date.substring(0, 7).replace('-', '.');
    document.getElementById('month-prev').dataset.ym = prevMonth(date);
    document.getElementById('month-next').dataset.ym = nextMonth(date);

    let tblMonth = document.getElementById('tbl-month');
    tblMonth.innerHTML = '';

    let td = '<td class="__REST__ __TODAY__"><a __HREF__>__DATE__</a></td>';
    let href = '/depart/schedule?date=' + date.substring(0, 8);
    let hasEvent;
    let tdClass;
    let week = null;
    let days = fullDays(date);

    for (let i = 0, length = days.length; i < length; i += 7) {
        week = days.slice(i, i + 7);
        let tr = document.createElement('tr');

        week.forEach(function (obj, index) {
            hasEvent = (index === 3);
            tdClass = (index === 0) ? 'sun' : '';
            tdClass = (index === 6) ? 'sat' : tdClass;

            let cell = td.replace('__REST__', tdClass)
                .replace('__TODAY__', (obj.today) ? 'today' : '')
                
                .replace('__HREF__', (hasEvent) ? 'href="' + href + ('0' + obj.date).slice(-2) + '"' : '')
                .replace('__DATE__', obj.date);

            tr.innerHTML += cell;
        });

        tblMonth.appendChild(tr);
    }
}

window.onload = function () {
    let date = (new Date()).toISOString().substring(0, 10);
    drawMonth(date);

    document.querySelectorAll('.month-move').forEach(function (button) {
        button.addEventListener('click', function () {
            drawMonth(this.dataset.ym);
        });
    });
};
