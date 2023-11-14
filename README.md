
# Vue 3 + TypeScript + Vite
前端-如何加载1w条数据

## 方式一
分页：setTimeout
```js

const container = document.getElementById("container");

 const renderList = async ()=>{

   const list = awit getListData()

   const total = list.length;
   let page = 0;
   let limit = 200;
   let totalPage = Math.ceil(total/limit);
   const render = (page)=>{
       if(page>=totalPage)return
      setTimeout(()=>{
         for(let i = page*limit ; i< page*limit + limit;i++){
            const item = list[i];
            const div = document.createElement('div')
            div.innerHTML = `<img src="${item.imgUrl}" /><span>${item.title}</span>`
            container.appendChild(div)
         }
         render(page+1)
      },0)
   }
   render(0);

 }

```

## 方式二
分页：requrestAnimationFrame 减少重排
```js
const renderList = async ()=>{

   const list = await getList()

   const total = list.length;
   let page = 0;
   let limit = 200;
   let totalPage = Math.ceil(total/limit);

   const render =(page)=>{
      if(page>=totalPage)return
      requrestAnimationFrame(()=>{
         for(let i = page*limit;i<page*limit+limit;i++){
            let item = list[i];
            const div = document.createElement('div')
            div.innerHTML = ``
            container.appendChild(div)
         }
         render(page+1)
      })
   }
   render(0)
}

```

## 方式三
分页： requrestAnimationFrame + createDocumentFragement (减少插入的次数)
```js
const renderList = async ()=>{

   const list = await getList();
   const total = list.length;
   let page =0;
   let limit = 200;
   let totalPage = Math.ceil(total/limit)
   const render=(page)=>{
     if(page>==totalPage)return
      const fragment = createDocumentFragement()
      requrestAnimationFrame(()=>{
         for(let i = page*limit;i<page*limit+limit;i++){
            const div = document.createElement('div')
            div.innerHTML = ``
            fragment.appendChild(div)
         }
         container.appendChild(fragment)
         render(page+1)
      })
   }
   render(0)
}
```

## 方式四
懒加载： 刚开始仅仅加载一页（仅展示可视区域），底部item触底时再加载第二页。 
```js
// 第一页底部item 触底后，再加载下一页
const totalPage = computed(() => Math.ceil(list.value.length / limit));
const showList = computed(() => list.value.slice(0, page.value * limit));
const handleScroll = ()=>{
   if(page>=totalPage)return
   const container = container.value?.clientHeight||0;
   //getBoundingClientRect
   const top = bankTop.value?.getBoundingClientRect().top||0
   if(top<=container){
      page++
   }
}
```

## 方式五
虚拟列表：只对可见区域进行渲染，不可见区域的数据不渲染。或者部分渲染（bufferPage：缓冲区域）

可视区域的高度固定，screenHeight
列表每项固定，itemSize
列表数据笃定，listData
当前滚动的位置，scrollTop
主要点：计算可见区域加载项

-  列表总高度 screenHeight = listData.length*itemSize
-  可显示的列表个数 visiableCount = Math.ceil(screenHeight/itemSize)
-  数据的起始索引 startIndex = Math.floor(srcrollTop/itemSize)
-  数据的结束索引 endIndex = startIndex + visiableCount
-  列表显示数据  visiableData = listData.slice(startIndex,endIndex)
-  偏移量 startOffset = scrollTop - (scrollTop%itemSize)

```js

// handleScrollEvent

const scrollEvent = ()=>{
   const scrollTop = list.value?.scrollTop ||0
   startIndex.value = Math.floor(scrollTop/itemSize)
   endIndex.value = startIndex.value + visiableCount.value;

   startOffset = scrollTop - (scrollTop % itemSize)



}









```
