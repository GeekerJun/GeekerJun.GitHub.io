


###### 首先我们了解一下普通对象 与 函数对象

我们在学习原型之前首先了解一下javascript当中的 **普通对象** 和 **函数对象**, 

**如图1**

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112147267.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)




- **普通对象:**
  - 最普通的对象：具有_ _ proto_ _这个属性它（指向其原型链），注意: 普通的对象是没有prototype这个属性的! 如果你调用必然返回undefined
  - 原型对象: 我们会在下面继续说明!

javascript中哪些情况属于**普通对象** 如下代码:

```js
//普通对象  
function Test() {

}
var obj1 = new Test();
var obj2 = new Object();
var obj3 = {};


console.log(typeof obj1);    //Object
console.log(typeof obj2);    //Object
console.log(typeof obj3);    //Object
```








- **函数对象**：

  - 凡是用Function()创建的都是函数对象。 比如:自定义函数,  事件函数 系统的Object、Array、Date、String、RegEx 以上都属于 **函数对象**

 		==小提示:== 以上的都是Function的实例对象, 那么也只有实例才会有_ _ proto_ _ 这个属性

​         ==注意:==  这里的Function是比较特殊的函数对象, 因为Function.prototype本身它应该指向是原型对象, 但Function的prototype却是函数对象  上图已经有说明!



javascript中哪些情况属于**函数对象** 如下代码:

```javascript
//函数对象  

function F1(){
    
}

var F2 = function(){
    
}
var F3 = function(a,b){
    
}


window.onload=function () {
    var div1=document.getElementById('div1');
    div1.onclick=function () {
        alert(1);
    }
    console.log(typeof div1.onclick);   //function  
}

 
console.log(typeof F1);  	  //function  
console.log(typeof F2);  	  //function  
console.log(typeof F3);       //function  

console.log(typeof Object);   //function  
console.log(typeof Array);    //function  
console.log(typeof String);   //function  
console.log(typeof Date);     //function  
console.log(typeof RegEx);    //function  
console.log(typeof Function); //function  
```



**函数对象都是Function的实例对象**

就如同Array是通过Function创建出来的。

因为Array是Function的实例，是实例就会有._ _ proto_ _  这个属性, 从上面的流程图上看 一个函数对象的_ _ proto_ _属性值是: ƒ () { [native code] }

而特殊的Function.prototype的值也是一个: ƒ () { [native code] }



所以我们可以推断出一个条件:  函数对象._ _ proto_ _ === Function.prototype      是成立的!  返回true

由此引出下面判断条件:

```javascript
Array._ _proto_ _  == Function.prototype     //true

String._ _proto_ _ == Function.prototype     //true

RegExp._ _proto_ _== Function.prototype     //true

Date._ _proto_ _  == Function.prototype     //true
```



######   ƒ () { [native code] }  是什么?

native code 的意思是它是程序自带的，是二进制编译的无法显示出来代码,  native code是本地代码, 这里我们就简单的解释一下即可!



以上内容作为学习原型之前的铺垫了解即可!!  接下来我们就慢慢的拆解图1的细节内容!!

---





###### 引出两个问题



**问题1** 性能方面

如果创建一个对象 在内存的堆区中就会开辟一个空间来保存对象,如果每个对象里面有相同的方法也会被创建出来

这样就存在一个问题，就是公共的方法或者属性会存在内存当中n份..  , 大量的占用了内存开销!

**如图2**

每一个对象都生成了同样的**say()**方法,  这种代码中如果每个对象都有公共一样的方法 就显得很占据内存空间! 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112217176.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)




上图的代码如下

```javascript
function Person(name,age){
    this.name=name;
    this,age=age;
    this.say=function () {
        console('输出结果');
    }
}

var obj1=new Person();
var obj2=new Person();
var obj3=new Person();
var obj4=new Person();
var obj5=new Person();
```



**问题2** 属性 方法 不能共享!

有时候我们希望一个方法能够被多个相同对象类型都可以公共的进行使用!

例如: 定义一个数组私有方法, 而另外一个数组对象是不能访问这个私有方法的

代码案例:

```javascript
var arr=[5,5,10];
//arr数组对象的sum方法
arr.sum=function () {
    var result=0;
    for(var i=0;i<this.length;i++){
        result+=this[i];
    }
    return result;
}

console.log(arr.sum());  //结果: 20

var arr2=[10,10,10];
console.log(arr2.sum()); //结果: Uncaught TypeError: arr2.sum is not a function
```

> 解答: 这里报错是因为 arr2 这个数组对象 根本就不存在sum() 这个方法,  它是属于arr数组对象私有的一个方法!
>
> 所以有时候我们希望一个方法能够被多个相同对象类型都可以公共的来使用!





以上两个问题 , 问题1是性能优化不足，问题2是私有方法不能被相同类型的对象调用 ,  所以解决上述问题方法或属性不能共享的办法 就要用到: **原型**  [提高性能] 也就是通常说的: **原型模式**



接下来我们就来探讨一下原型是什么！



---





###### 原型对象是什么!

根据图1 函数对象都有一个prototype属性指向的是一个原型对象, 那么我们可以推出以下概念:

**每创建一个函数都会有一个prototype属性，这个属性是一个指针，指向一个对象（原型对象）**

**原型对象,也就是(构造函数.prototype),  当中含有一个constructor 属性 这个属性（指向的就是当前原型对象的构造函数）**

如下图:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112241423.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)




**原型对象作用:**是包含特定类型的所有实例共享的属性和方法, 就是说你把属性和方法定义在原型对象里面之后，那么这个类型的实例就都会共享这些属性和方法!

**原型对象优点**: 就是可以让所有实例对象共享它所包含的属性和方法。





###### 原型对象的语法基础



要特定类型的所有实例都共享的属性和方法, 就要把它们定义在原型对象的下面!

原型: 要使用==prototype==这个关键字,  要写在构造函数的下面:

```javascript
//语法如下

构造函数名.prototype.属性=值;

构造函数名.prototype.方法=function(){
		..代码段..
} 
```

如下图: 所以用: 构造函数名.prototype 你就可以把属性和方法定义在原型对象当中

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112258640.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)



案例代码:

```javascript
function createPerson(name,age) {
    this.name=name;
    this,age=age;
}

createPerson.prototype.say=function () {
    console.log('我的名字叫'+this.name);
}

var a=new createPerson('张三','33');
var b=new createPerson('李四','55');
var c=new createPerson('王武','66');

a.say();
b.say();
c.say();
```



为了方便理解 我画了一张图, 以上代码的流程图分析如下图:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112315879.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)






###### 特殊的Function.prototype

Function.prototype是个例外，为什么说它是一个例外呢?   按道理来说它这里获取出来的应该是一个原型对象，但却是一个函数对象，

作为一个函数对象，它又没有prototype属性。  从图1中就可以看出来这个道理!

你用Function.prototype 获取出来是一个: ƒ () { [native code] }  这个东西是什么上面已经解释过了!

如下图:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112326477.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)








###### 原型知识点

为了节省内存，我们把对象的方法都放在原型里面。为什么呢？ 

因为改写对象下面公用的方法或者属性、让公用的方法或者属性在内存中只存在一份

在我们通过new实例化对象的时候，在内存中，会自动拷贝构造函数中的所有属性和方法，用来给实例对象赋值，而不管我们实例化多少次，原型里面的属性和方法只生成一次，所以会节省内存。



###### 普通定义方式与原型定义的优先级高低 



如下代码: 

```javascript
function createPerson(name,age) {
            this.name=name;
            this,age=age;
        }

createPerson.prototype.say=function () {
    console.log('我的名字叫'+this.name);
}

var a=new createPerson('张三','33');
var b=new createPerson('李四','55');
var c=new createPerson('王武','66');

a.say();
b.say();
c.say();

//普通定义的优先级高于原型prototype
c.say=function(){
    console.log('输出ok');
}
        
c.say();

```

所以以上的普通定义的方式要比原型定义的方式的优先级高！,但这并不是把原型覆盖了 只是优先调用普通定义的方法

如图:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112342539.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)






---



###### 原型的中的 _ _ proto_ _

> 首先回顾一下, 实例化new的时候，系统会在内存中创建了一个空的对象，就像是这样 var p = {} , 拷贝构造函数中的属性和方法到空对象中。

重点的是:  每个实例化对象都会有一个 _ _ proto_ _ 属性,  这个属性是自动生成的,  _ _ proto_ _ 属性指向类的原型对象。



**构造函数、实例化对象、原型对象的之间的关系**

先来看一段代码案例

```javascript
function createPerson(name,age) {
    this.name=name;
    this,age=age;
}

createPerson.prototype.say=function () {
    console.log('我的名字叫'+this.name);
}

var obj=new createPerson('张三','33');

console.log(obj.__proto__);              //实例化obj的__proto__属性 可以获取到原型对象
console.log(createPerson.prototype);     //构造函数的prototype属性  也可以获取到原型对象
console.log(obj.__proto__.constructor);  //原型对象中的constructor又可以获取到构造函数

```

###### 构造函数、实例化对象、原型对象的基本关系图分析



![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112404573.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)




当然你也可以通过 实例化对象的_ _ proto_ _属性 和 构造函数的prototype属性进行比较可以验证结果,  我们可以通过打印来验证

```javascript
console.log(实例化对象._ _proto_ _ === 构造函数.prototype);     //true
```



定义在实例和定义在原型下的区别总结:

先看一段代码案例:

```javascript
function Test(){
    
}
//定义属性
Test.prototype.name = "张三";  
Test.prototype.age =  33;
//定义方法
Test.prototype.getAge = function(){  
    return this.age;  
}  
  
var t1 = new Test();  
var t2 = new Test();
var t3 = new Test();  
t3.name = "李四";  

console.log(t1.name); // 张三 来自原型  
console.log(t2.name); // 张三 来自原型  
console.log(t3.name); // 李四 来自实例  

//打印实例看下图结果
console.log(t1);
console.log(t2);
console.log(t3);

```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112423982.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)


以上图就解释了为什么定义在原型中 属性和方法是公用的, 而单独定义在实例中是属于独立的属性和方法不共有!

> 所以 我们也推断出 在实例中定义属性和方法 会覆盖 或者说 会实现调用实例中定义的属性和方法 如果没有才会到原型中去寻找!  这里其实就是我们一会要讲到的原型链!







###### _ _ proto_ _与 prototype的详细认识

**1.所有的引用类型,比如数组、对象、都有一个_ _ proto_ _属性(也叫==隐式原型==，它来指向自己的原型对象)**

> 重点再次提醒: 所有的对象引用 都有_ _ proto_ _ 这个属性! 记住了!

通过下面的测试我们不难发现，其中它们赋值的引用对象中 打印出来看到都有一个 _ _ proto_ _的属性 都是指向自己的原型对象

代码如下:

```javascript
function createPerson(name,age) {
     this.name=name;
     this,age=age;
}
createPerson.prototype.say=function () {
    console.log('我的名字叫'+this.name);
}
var obj=new createPerson('测试','33');

//对象引用打印
console.log(obj);


var arr=[1,2,3];
//数组引用的打印
console.log(arr);

var arr2=new Array(2,2,2);
//数组引用的打印
console.log(arr2);


```

**2.再一次重点注意: 所有引用类型，它的_ _ proto_ _属性指向这个引用本身的原型对象  而构造函数的prototype属性的值也就是指向的原型对象 **

> 所以在各自相应引用类型的_ _ proto_ _属性 和 构造函数的 prototype属性 彼此它们两个是相等的! 上面的图中也可以表明这一点!

_ _ proto_ _属性 和 构造函数的 prototype属性比较, 案例代码如下:

```javascript
//案例1
function createPerson(name,age) {
    this.name=name;
    this,age=age;
}
createPerson.prototype.say=function () {
    console.log('我的名字叫'+this.name);
}

var obj=new createPerson('张三','33');

console.log(obj.__proto__);   		   //打印出obj对象引用的原型对象  
console.log(createPerson.prototype);   //打印出createPerson构造函数的原型对象
console.log(obj.__proto__===createPerson.prototype);  //而且它们是相等的，指向同一个原型对象

//案例2
var arr=new Array(2,2,2);
console.log(arr.__proto__);
console.log(Array.prototype);
console.log(arr.__proto__ === Array.prototype);
```



**3.所有的构造函数 或者 普通函数都有一个prototype属性 (这也叫显式原型，它也指向自己的原型对象)。**

案例代码:

```javascript
//普通函数
function Test() {

}
//打印普通函数的prototype属性
console.log(Test.prototype);


//构造函数
function createPerson(name,age) {
     this.name=name;
     this,age=age;
}
createPerson.prototype.say=function () {
    console.log('我的名字叫'+this.name);
}

console.log(createPerson.prototype);

```

图解如下:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112451691.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)







###### _ _proto _ _和 prototype区别

==prototype==是每个函数都会具备的一个属性，它是一个指针，指向原型对象，只有**普通函数**或 **构造函数**才有。

==_ _ proto_ _==属性 是主流浏览器上在除null对象以外的每个引用对象上都支持存在的一个属性，它能够指向当前该引用对象的:**原型对象**
其实==_ _ proto_ _== 就是用来将引用对象与原型相连的属性

**小结:** 一个只有函数才有的属性(prototype)，一个是引用对象才有的属性(_ _ proto_ _ ),  

**注意**: 你用一个函数去调用属性(_ _ proto_ _ ), 会得到一个: ƒ () { [native code] }





###### 原型中批量添加属性与方法

使用==prototype==这个关键字,  要批量的把属性和方法写入原型 就在构造函数的下面写一个JSON格式 如下代码, 这样比单一的一个个写方便!

```javascript
//语法
构造函数.prototype={
    属性名: 值,
    方法名:function(){
        //方法体...   这里的this是什么要看执行的时候谁调用了这个函数
    },
    方法名:function(){
       //方法体...   这里的this是什么要看执行的时候谁调用了这个函数
    }
}
```

案例代码:

```javascript
 createPerson.prototype={
     aaa:123,
     // prototype对象里面又有其他的属性
     showName:function(){
         //this是什么要看执行的时候谁调用了这个函数
         console.log("我的名字叫:"+this.name);
     },
     showAge:function(){
         //this是什么要看执行的时候谁调用了这个函数
         console.log("我的年龄是:"+this.age);
     }
 }

function createPerson(name,age) {
    this.name=name;
    this.age=age;
}
var obj= new createPerson('张三','33');
console.log(obj);
obj.showName();
obj.showAge();
console.log(obj.aaa);
```

以上原型代码 图解

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112510792.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)



原型注意事项

==**<code>重点注意</code>**==

> 如果是自定义构造函数，并且使用{ }这种方式批量的在prototype中定义属性和方法， 会改变原型中constructor对构造函数的指向!

==也就是说使用{ }这种方式批量在prototype中定义属性和方法, 那么constructor的指向就是一个函数对象==

测试代码如下

```javascript
function createPerson(name,age) {
    this.name=name;
    this,age=age;
}

/* createPerson.prototype.say=function(){
      console.log('我的名字叫'+this.name);
}*/

createPerson.prototype={
    say:function () {
        console.log('我的名字叫'+this.name);
    }
}

var obj=new createPerson('张三','33');
console.log(obj.__proto__);
```

在控制台输出会看到 _ _proto _ _的值, constructor这个属性就没有了!

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112530417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)




```javascript
console.log(createPerson.prototype.constructor);   //返回   ƒ Object() { [native code] }
```







###### 原型基本小结

> 1. 让相同方法在内存中存在一份
> 2. 原型定义方式要比普通定义方式的优先级要低
> 3. 在项目当中公共相同的属性和方法可以加载在原型上







###### 原型链 核心原理

首先这里要提出一点的是 在JS中实现继承主要是依靠原型链来实现! ，所以我们才需要学习原型链的原理!



**原型链核心概念**

**原型链: 当试图调用或想得到一个对象实例中的属性 或 方法时，如果这个对象本身不存在这个属性 或 方法 也就是说构造函数中没有定义你想要的属性或方法，那么就会通过构造函数的prototype属性到原型中去 寻找这个属性 或者 方法** ==(也就是它的构造函数的’prototype’属性会到原型对象中去寻找)  ,  如果有就返回,如果没有就会到顶层的Object去找 , 如果有就返回, 如果还是找不到就返回undefined!==



==原型链流程图==

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112549830.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)


上图可以用以下例子来说明：当构造函数 `Test` 存在 `getName` 这个方法时，就不用到构造函数的原型当中去找 `getName `这个方法；反之，就到构造函数的原型当中去找 `getName `这个方法；如果构造函数的原型中也不存在 `getName  `这个方法时，就要到顶层对象的原型中去找 `getName `这个方法。

上图测试案例代码如下：

```javascript
function Test(name){
    this.name=name;
    this.getName=function(){
        return this.name+"我在构造函数中"; 
    }
}
Test.prototype.getName=function(){
    return this.name+"我在原型对象中";
}
Object.prototype.getName=function(){
    return this.name+"我在顶层对象中";
}
var t1=new Test('小红');

console.log(t1.getName());
```





原型链案例代码2 如下:

```javascript
Array.prototype.aaa=123;    //把这个自定义属性定义到原型对象下
var arr=new Array(1,2,3);
console.log(arr.aaa);
console.log(Array.prototype);

var arr2=['重庆','上海','北京'];
console.log(arr2.aaa);
```



如下图:

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112609426.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)


==小结==: arr 和 arr2都能够找到aaa这个属性, 并且这个属性是数组原型对象下的属性,是公共的

只要是数组就可以调用这个属性, 同理方法也是一样,

所以创建很多很多个相同类型对象的时候, 创建出来的每一个对象，如果里面都有一些公共的方法，这样就会占用很多的资源, 

而通过原型来实现的话，只需要在构造函数里面给属性赋值，而把方法写在prototype属性,当然属性也是可以写在原型当中的, 

这样每个对象引用都可以使用prototype属性里面的方法 或 属性，并且节省了不少的资源



这就是我们为什么要使用原型的原因!



---



###### 原型链总体结构图解小结

**当试图调用或想得到一个对象实例中的属性 或 方法时，如果这个对象本身不存在这个属性 或 方法 那么就会通过构造函数的prototype属性到原型中去 寻找这个属性 或者 方法**  ==如果有就返回,如果没有就会到顶层的Object去找 , 如果有就返回, 如果还是找不到就返回undefined!==

但又因为构造函数中的prototype属性值本身又是一个对象(原型对象), 所以这里它也有一个_ _ proto_ _ 属性 , 就可以向上继续获取_ _ _ proto_ _属性  , 那么这里获取出来的就是顶层的Object对象 

如下图:



![在这里插入图片描述](https://img-blog.csdnimg.cn/20201024112626208.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpbmRvd3N4cDIwMTg=,size_16,color_FFFFFF,t_70#pic_center)




小结:

当obj调用test()方法，JS发现Fn中没有这个方法，于是它就去Fn.prototype中去找，发现还是没有这个方法，然后就去Object.prototype中去找，找到了，就调用Object.prototype中的test()方法。

这就是原型链查找，而则一层一层的链接的关系就是:原型链。

obj能够调用Object.prototype中的方法正是因为存在原型链关系的机制!

另外，在使用原型的时候，一般推荐将需要扩展的方法写在 构造函数.prototype属性中，

而不要写在: 构造函数.prototype._ _ proto _ _中, 因为这里也就是Object顶层对象，定义到这里的属性和方法 所有JS对象都可以调用，在这里面定义多了就会影响整体性能，所以不建议定义到这里!







