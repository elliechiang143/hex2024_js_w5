let ticketData = [];
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json')
  .then(function (response) {
    ticketData = response.data;
    renderAreaChart(ticketData);
    renderTicketCardList(ticketData);
    changeSearchResultNumber(ticketData.length);
  })
  .catch(function (error) {
    console.log(error);
  })

function createAreaChartData(data){
  const areaObj = {};
  data.forEach(function(item){
    if(areaObj[item.area] == undefined){
      areaObj[item.area] = 1
    }else{
      areaObj[item.area] ++
    }
  })
  // areaObj: {高雄: 1, 台北: 1, 台中: 1}

  const areaAry = Object.keys(areaObj)
  // areaAry: ['高雄', '台北', '台中']

  const areaChartData = [];
  areaAry.forEach(function(item){
    const ary = []
    ary.push(item, areaObj[item])
    areaChartData.push(ary)
  })
  // console.log(areaChartData);
  return areaChartData;
}

function renderAreaChart(ticketData){
  const chart = c3.generate({
    bindto: '#areaChart',
    size: {
      width: 160,
      height: 160
    },
    data: {
      columns: createAreaChartData(ticketData),
      type : 'donut',
      colors: {
        '台北': '#26C0C7',
        '台中': '#5151D3',
        '高雄': '#E68618',
      }
    },
    donut: {
        title: "套票地區比重",
        width: 10,
        label: {
          show: false
        }
    }
  });
}

// 本次搜尋共幾筆資料----------------------
const searchResult = document.querySelector('#searchResult-text');
function changeSearchResultNumber(result){
  searchResult.innerHTML = `本次搜尋共 ${result} 筆資料`
}
// 本次搜尋共幾筆資料----------------------END


// 渲染票券卡片----------------------------
const ticketList = document.querySelector('.ticketCard-area')
// 設定變數存放ticketCard的內容
let ticketCardHTML = '';
function renderTicketCardList(dataArray) {
  // 1. 清空 ticketList HTML 內容。避免渲染出錯
  ticketList.innerHTML = '';
  // 2. 清空 ticketCardHTML 內容。避免渲染出錯
  ticketCardHTML = '';
  // 3. 利用 forEach 遍歷 ticketData 中的元素，組成新的 HTML 結構
  dataArray.forEach(function (ticketData) {
    ticketCardHTML += `
      <li class="ticketCard">
          <div class="ticketCard-img">
            <a href="#">
              <img src="${ticketData.imgUrl}" alt="">
            </a>
            <div class="ticketCard-region">${ticketData.area}</div>
            <div class="ticketCard-rank">${ticketData.rate}</div>
          </div>
          <div class="ticketCard-content">
            <div>
              <h3>
                <a href="#" class="ticketCard-name">${ticketData.name}</a>
              </h3>
              <p class="ticketCard-description">
              ${ticketData.description}
              </p>
            </div>
            <div class="ticketCard-info">
              <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${ticketData.group} </span> 組
              </p>
              <p class="ticketCard-price">
                TWD <span id="ticketCard-price">$${ticketData.price}</span>
              </p>
            </div>
          </div>
        </li>
      `
  })
  // 4. 利用 innerHTML 將新的 HTML 結構寫到 ticketList 中
  ticketList.innerHTML = ticketCardHTML;
  changeSearchResultNumber(dataArray.length)
}
// 載入頁面時渲染全部的資料
renderTicketCardList(ticketData);
// 渲染票券卡片----------------------------END


// 地區搜尋功能----------------------------
const searchSelect = document.querySelector('.regionSearch');
function searchArea() {
  // 監聽下拉選單改變事件
  searchSelect.addEventListener('change', function () {
    // 把改變下拉選單時的 value 存進一個變數 currentArea
    const currentArea = searchSelect.value;
    // 如果 value 為空值時(全部) 渲染全部的 ticketData
    if (currentArea === '') {
      renderTicketCardList(ticketData);
      changeSearchResultNumber(ticketData.length);
    } 
    // 若 currentArea 為其他值時，用 filter 篩選出 ticketData.area 與 currentArea 的值相同的物件，並用一個新變數 dataAreaFilter 儲存 filter 陣列
    else {
      const dataAreaFilter = ticketData.filter(function (data) {
        return data.area === currentArea;
      })
      renderTicketCardList(dataAreaFilter);
      changeSearchResultNumber(dataAreaFilter.length);
    }
  })
}
searchArea();
// 地區搜尋功能----------------------------END



const ticketNameInput = document.querySelector('#ticketName');
const ticketImgUrlInput = document.querySelector('#ticketImgUrl');
const ticketRegionSelect = document.querySelector('#ticketRegion');
const ticketPriceInput = document.querySelector('#ticketPrice');
const ticketNumInput = document.querySelector('#ticketNum');
const ticketRateInput = document.querySelector('#ticketRate');
const ticketDescriptionInput = document.querySelector('#ticketDescription');
const addTicketBtn = document.querySelector('.addTicket-btn');

// 清空 input 值----------------------------
function clearInput(){
  
  ticketNameInput.value ='';
  ticketImgUrlInput.value ='';
  ticketRegionSelect.value ='';
  ticketDescriptionInput.value ='';
  ticketNumInput.value ='';
  ticketPriceInput.value ='';
  ticketRateInput.value ='';
  // 清空搜尋下拉選單
  searchSelect.value ='';
}
// 清空 input 值----------------------------END


// 清空必填訊息----------------------------
const message = document.querySelectorAll('.alert-message');
function clearMessage(){
  message.forEach(function(message){
    const alertMessage = message.querySelector('p')
    alertMessage.innerHTML = ``;
  })
}
// 清空必填訊息----------------------------END


// 顯示必填提示----------------------------
function showAlertMessage(){
  const field = [
    {
      inputId: document.querySelector('#ticketName'),
      alertMessageId: document.querySelector('#ticketName-message'),
    },
    {
      inputId: document.querySelector('#ticketImgUrl'),
      alertMessageId: document.querySelector('#ticketImgUrl-message'),
    },
    {
      inputId: document.querySelector('#ticketRegion'),
      alertMessageId: document.querySelector('#ticketRegion-message'),
    },
    {
      inputId: document.querySelector('#ticketPrice'),
      alertMessageId: document.querySelector('#ticketPrice-message'),
    },
    {
      inputId: document.querySelector('#ticketNum'),
      alertMessageId: document.querySelector('#ticketNum-message'),
    },
    {
      inputId: document.querySelector('#ticketRate'),
      alertMessageId: document.querySelector('#ticketRate-message'),
    },
    {
      inputId: document.querySelector('#ticketDescription'),
      alertMessageId: document.querySelector('#ticketDescription-message'),
    },
  ]
  const alerHTML = `<i class="fas fa-exclamation-circle"></i><span>必填!</span>`;

  clearMessage();

  field.forEach(function(item){
    if(item.inputId.value === ''){
      item.alertMessageId.innerHTML = alerHTML;
    }
  })
}
// 顯示必填提示----------------------------END


// 新增新增旅遊套票----------------------------
function addTicket(){
  addTicketBtn.addEventListener('click', function(){
    let obj = {
      'name': ticketNameInput.value,
      'imgUrl': ticketImgUrlInput.value,
      'area': ticketRegionSelect.value,
      'description': ticketDescriptionInput.value,
      'group': ticketNumInput.value,
      'price': ticketPriceInput.value,
      'rate': ticketRateInput.value
    };
    // 判斷 obj 裡的值是否有空值
    let hasEmptyValue = false;
    Object.values(obj).forEach(function(value){
      if(value === ''){
        hasEmptyValue = true;
      }
    })

    if (hasEmptyValue){
      showAlertMessage();
    }else {
      ticketData.push(obj);
      clearInput();
      clearMessage();
      renderTicketCardList(ticketData);
      renderAreaChart(ticketData);
    }
  })
}
addTicket();
// 新增新增旅遊套票----------------------------END