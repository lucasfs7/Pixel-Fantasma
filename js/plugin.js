var L = L || {};
L.qtd = 0;
L.imgList = [];
L.pluginPrefix = "cpp-";
L.saveInterval = null;

L.init = function()
{
	//botão de fechar
	L.close = document.createElement("span");
	L.close.id = L.pluginPrefix + "close-plugin";
	L.close.innerHTML = "x";
	
	//botão add image
	L.add = document.createElement("span");
	L.add.id = L.pluginPrefix + "add-img";
	L.add.innerHTML = "+";
	
	//criando container
	L.container = document.createElement("div");
	L.container.id = L.pluginPrefix + "plugin-container";
	
	//colocando os botões no container
	L.container.appendChild(L.close);
	L.container.appendChild(L.add);
	
	//pegando o body da aba
	L.body = document.getElementsByTagName("body")[0];
	
	//colocando o container no body da aba
	L.body.appendChild(L.container);
	
	//eventos
	L.close.addEventListener("click", L.closeApp, false);
	L.add.addEventListener("click", L.create, false);
	
	//restaurando as imagens salvas
	if(localStorage && localStorage[L.pluginPrefix + "total"])
	{
		L.qtd = parseInt(localStorage.getItem(L.pluginPrefix + "total"), 10);
		if(L.qtd > 0)
		{
			for(var i = 0; i < L.qtd; i++)
			{
				L.newImage(i);
			}
		}
	}
}

L.newImage = function(id)
{
	//campo url da imagem
	var fileLabel = document.createElement("label");
	fileLabel.innerHTML = "URL da imagem: ";
	var file = document.createElement("input");
	file.type = "text";
	
	//campo posição x
	var posXLabel = document.createElement("label");
	posXLabel.innerHTML = "x: ";
	var posX = document.createElement("input");
	posX.type = "text";
	posX.value = "0";
	
	//campo posição y
	var posYLabel = document.createElement("label");
	posYLabel.innerHTML = "y: ";
	var posY = document.createElement("input");
	posY.type = "text";
	posY.value = "0";
	
	//campo opacidade
	var opacityLabel = document.createElement("label");
	opacityLabel.innerHTML = "opacity: ";
	var opacity = document.createElement("input");
	opacity.type = "range";
	opacity.value = "50";
	
	//centralizar
	var centraliza = document.createElement("button");
	centraliza.innerHTML = "centralize";
	
	//colocar em background
	var bgLabel = document.createElement("label");
	bgLabel.innerHTML = "in background";
	var bg = document.createElement("input");
	bg.type = "checkbox";
	
	//excluir
	var excrluir = document.createElement("span");
	excrluir.innerHTML = "x";
	excrluir.className = L.pluginPrefix + "excluir-img";
	
	//cria o container da imagem
	var div = document.createElement("div");
	div.className = L.pluginPrefix + "plugin-img-config-container";
	
	//insere os elementos na div
	div.appendChild(fileLabel);
	div.appendChild(file);
	div.appendChild(posXLabel);
	div.appendChild(posX);
	div.appendChild(posY);
	div.appendChild(opacityLabel);
	div.appendChild(opacity);
	div.appendChild(centraliza);
	div.appendChild(bg);
	div.appendChild(bgLabel);
	div.appendChild(excrluir);
	
	//insere a div no container geral do plugin
	L.container.appendChild(div);
	
	//cria a imagem
	var img = document.createElement("img");
	img.className = L.pluginPrefix + "img";
	L.imgList[L.imgList.length] = img;
	
	//restaura as configurações salvas
	var savedConfig = restoreData();
	if(savedConfig)
	{
		L.body.appendChild(img);
		drag(img);
	}
	
	//setando as configurações iniciais da imagem
	img.src = file.value;
	img.style.top = posY.value + "px";
	img.style.left = posX.value + "px";
	img.style.opacity = "." + opacity.value;
	bgListener();

	function fileListener()
	{
		if(file.value.length > 0)
		{
			img.src = file.value;
			L.body.appendChild(img);
			centralizaListener();
			drag(img);
		}
	}

	function posXListener()
	{
		if(posX.value.length > 0)
		{
			img.style.left = posX.value + "px";
		}
	}

	function posYListener()
	{
		if(posY.value.length > 0)
		{
			img.style.top = posY.value + "px";
		}
	}

	function opacityListener()
	{
		if(opacity.value >= 0 && opacity.value <=99)
		{
			if(opacity.value < 10)
			{
				opacity.value = 0;
			}
			img.style.opacity = "." + opacity.value;
		}
	}
	
	function centralizaListener()
	{
		var newLeft = ((L.body.offsetWidth / 2) - (img.offsetWidth / 2));
		img.style.left = newLeft + "px";
		posX.value = newLeft;
	}
	
	function posXAdd(e)
	{
		var tecla = e.keyCode;
		if(tecla == "40")
		{
			posX.value = parseInt(posX.value, 10) - 10;
			img.style.left = posX.value + "px";
		}
		else if(tecla == "38")
		{
			posX.value = parseInt(posX.value, 10) + 10;
			img.style.left = posX.value + "px";
		}
	}
	
	function posYAdd(e)
	{
		var tecla = e.keyCode;
		if(tecla == "40")
		{
			posY.value = parseInt(posY.value, 10) - 10;
			img.style.top = posY.value + "px";
		}
		else if(tecla == "38")
		{
			posY.value = parseInt(posY.value, 10) + 10;
			img.style.top = posY.value + "px";
		}
	}
	
	function bgListener()
	{
		setTimeout(function()
		{
			if(bg.checked)
			{
				img.style.zIndex = "-1";
			}
			else
			{
				img.style.zIndex = "";
			}
		}, 1);
	}
	
	function saveData()
	{
		if(localStorage)
		{
			localStorage.setItem(L.pluginPrefix + id + "-img", file.value);
			localStorage.setItem(L.pluginPrefix + id + "-x", posX.value);
			localStorage.setItem(L.pluginPrefix + id + "-y", posY.value);
			localStorage.setItem(L.pluginPrefix +id + "-opacity", opacity.value);
			localStorage.setItem(L.pluginPrefix +id + "-bg", bg.checked);
		}
	}

	function restoreData()
	{
		if(localStorage && 
			localStorage[L.pluginPrefix + id + "-img"] && 
			localStorage[L.pluginPrefix + id + "-y"] && 
			localStorage[L.pluginPrefix + id + "-x"] && 
			localStorage[L.pluginPrefix + id + "-opacity"] &&
			localStorage[L.pluginPrefix +id + "-bg"])
		{
			file.value = localStorage.getItem(L.pluginPrefix + id + "-img");
			posX.value = localStorage.getItem(L.pluginPrefix + id + "-x");
			posY.value = localStorage.getItem(L.pluginPrefix + id + "-y");
			opacity.value = localStorage.getItem(L.pluginPrefix + id + "-opacity");
			bg.checked = localStorage.getItem(L.pluginPrefix + id + "-bg");
			return true;
		}
		else
		{
			return false;
		}
	}
	
	function excrluirListener()
	{
		L.container.removeChild(div);
		L.qtd--;
		if(localStorage && 
			localStorage[L.pluginPrefix + id + "-img"] && 
			localStorage[L.pluginPrefix + id + "-y"] && 
			localStorage[L.pluginPrefix + id + "-x"] && 
			localStorage[L.pluginPrefix + id + "-opacity"])
		{
			localStorage.removeItem(L.pluginPrefix + id + "-img");
			localStorage.removeItem(L.pluginPrefix + id + "-x");
			localStorage.removeItem(L.pluginPrefix + id + "-y");
			localStorage.removeItem(L.pluginPrefix + id + "-opacity");
			localStorage.removeItem(L.pluginPrefix + id + "-bg");
		}
	}
	
	//função de drag
	function drag(elem){
		//variáveis
		var elem = (typeof elem == "string" ? document.getElementById(elem) : elem);
		var isDragging = false;
		var mouseCoords = [0,0];

		//function que inicia o drag
		var iniciaDrag = function(){
			//seta variavel dizendo q o drag está ativo
			isDragging = true;
			//chama a função q faz o drag
			doDrag();
		}

		//function que faz o drag
		var doDrag = function(){
			//seta as novas posições do elemento de acordo com as coordenadas do mouse
			var newLeft = (mouseCoords[0] - (elem.offsetWidth / 2));
			var newTop = (mouseCoords[1] - (elem.offsetHeight / 2));
			elem.style.left = newLeft + "px";
			elem.style.top = newTop + "px";
			//coloca a nova posição do elemento nos input
			posX.value = newLeft;
			posY.value = newTop;
			//se o drag está ativo chama novamente a mesma função
			if(isDragging){
				//seta um tempo para chamar a função novamente para não dar erro de 'too much recursive'
				setTimeout(function(){
					//chamada para a função de drag
					doDrag();
				},1);
			}
		}

		//função que desative o drag
		var finalizaDrag = function(){
			//seta a variável dizendo q o drag está inativo
			isDragging = false;
		}

		//function que checa as coordenadas do mouse se acordo com seu movimento
		var checkMouseCoords = function(e){
			//captura o evento
			e = e || window.event;
			//captura as novas coordenadas do mouse e seta em um array (x,y)
			mouseCoords = [e.pageX, e.pageY];
		}

		//remove as ações padRão de eventos que pode influenciar no drag
		elem.onselectstart = function(){return false;}
		elem.onclick = function(){return false;}
		elem.onmousedown = function(){return false;}
		elem.onmousemove = function(){return false;}
		elem.onmouseup = function(){return false;}

		//adiciona as funções de drag aos eventos necessários
		elem.addEventListener("mousedown",iniciaDrag, false);
		document.addEventListener("mousemove",checkMouseCoords, false);
		elem.addEventListener("mouseup",finalizaDrag, false);
	}

	file.addEventListener("change", fileListener, false);
	posX.addEventListener("change", posXListener, false);
	posX.addEventListener("keydown", posXAdd, false);
	posY.addEventListener("change", posYListener, false);
	posY.addEventListener("keydown", posYAdd, false);
	opacity.addEventListener("change", opacityListener, false);
	centraliza.addEventListener("click", centralizaListener, false);
	bg.addEventListener("change", bgListener, false);
	excrluir.addEventListener("click", excrluirListener, false);
	
	setInterval(saveData, 5000);
}

L.create = function()
{
	L.newImage(L.qtd);
	localStorage.setItem(L.pluginPrefix + "total", L.qtd);
	L.qtd++;
}

L.closeApp = function()
{
	L.body.removeChild(L.container);
	L.container = null;
	for(var i = 0; i < L.imgList.length; i++)
	{
		L.body.removeChild(L.imgList[i]);
	}
	L.imgList = [];
}

L.clearStorage = function()
{
	for(var i in localStorage)
	{
		localStorage.removeItem(i);
	}
}

//L.clearStorage();

if(L.container)
{
	L.closeApp();
}
else
{
	L.init();
}

L.saveInterval = setInterval(function()
{
	localStorage.setItem(L.pluginPrefix + "total", L.qtd);
}, 5000);