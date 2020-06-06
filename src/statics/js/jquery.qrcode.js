(function( $ ){
	$.fn.qrcode = function(options) {
		// if options is string, 
		if( typeof options === 'string' ){
			options	= { bizLinkId64: options };
		}

		// set default values
		// typeNumber < 1 for automatic calculation
		options	= $.extend( {}, {
			render		: "canvas",
			width		: 1000,
            height		: 1000,
            logoR       : 100,
			typeNumber	: -1,
            correctLevel	: QRErrorCorrectLevel.H,
            foreground:"#000000",
            background      : "#ffffff",
            remarkFontSize: 64,
            remarkFontColor: "#000000",
            remarkFontType: "SimHei"
        }, options);
        
		var createCanvas	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.bizLinkId64);
			qrcode.make();

			// compute tileW/tileH based on options.width/options.height
			var tileW	= options.width  / qrcode.getModuleCount();
            var tileH	= options.height / qrcode.getModuleCount();

            // create canvas element
			var canvas	= document.createElement('canvas');
			canvas.width	= options.width + 3*tileW*2;
            canvas.height	= options.height+ 3*tileH*2;
            options.width	= canvas.width;
            options.height	= canvas.height;
            
            if(options.remark1){
                canvas.height = canvas.height + options.remarkFontSize*1.5;
            }
            if(options.remark2){
                canvas.height = canvas.height + options.remarkFontSize*1.5;
            }
            
            var ctx		= canvas.getContext('2d');
            ctx.fillStyle = options.background;
            ctx.fillRect(0,0,canvas.width,canvas.height);

            //  0,纯色，1，横向，2，纵向  3，右下 4，左下，5中心
            var grd = options.foreground;
            switch (options.foregroundType) {
                case "1":
                    grd=ctx.createLinearGradient(0,0,options.width,0);
                    grd.addColorStop(0,options.foreground);
                    grd.addColorStop(1,options.foregroundEnd);
                    break;
                case "2":
                    grd=ctx.createLinearGradient(0,0,0,options.height);
                    grd.addColorStop(0,options.foreground);
                    grd.addColorStop(1,options.foregroundEnd);
                    break;
                case "3":
                    grd=ctx.createRadialGradient(0,0,Math.sqrt(2)*options.width/2,options.width,options.height,Math.sqrt(2)*options.width/2);
                    grd.addColorStop(0,options.foreground);
                    grd.addColorStop(1,options.foregroundEnd);
                    break;
                case "4":
                    grd=ctx.createRadialGradient(options.width,0,Math.sqrt(2)*options.width/2,0,options.height,Math.sqrt(2)*options.width/2);
                    grd.addColorStop(0,options.foreground);
                    grd.addColorStop(1,options.foregroundEnd);
                    break;
                case "5":
                    grd=ctx.createRadialGradient(options.width/2,options.height/2,options.logoR,options.width/2,options.height/2,Math.sqrt(2)*options.width/2);
                    grd.addColorStop(0,options.foreground);
                    grd.addColorStop(1,options.foregroundEnd);
                    break;
                default:
                    break;
            }
            ctx.fillStyle =  grd ;


			// draw in the canvas
			for( var row = 0; row < qrcode.getModuleCount(); row++ ){
				for( var col = 0; col < qrcode.getModuleCount(); col++ ){					
					var w = (Math.ceil((col+4)*tileW) - Math.floor((col+3)*tileW));
					var h = (Math.ceil((row+4)*tileH) - Math.floor((row+3)*tileH));
					if(qrcode.isDark(row, col)) ctx.fillRect(Math.round((col+3)*tileW),Math.round((row+3)*tileH), w, h);  
				}	
            }
            
            if(options.logo){
                var logoSize = (options.logoR) * 2;
                ctx.drawImage( options.logo, options.width/2-logoSize/2, options.height/2-logoSize/2,logoSize,logoSize);
            }
            
            
            // remark
            ctx.fillStyle = options.remarkFontColor;
            ctx.font = options.remarkFontSize + "px "+ options.remarkFontStyle;
            console.log(options.width - ctx.measureText(options.remark1).width/2);
            if(options.remark1)
                ctx.fillText(options.remark1 ,options.width/2 - ctx.measureText(options.remark1).width/2 , options.height + options.remarkFontSize*0.8);
            if(options.remark1 && options.remark2)
                ctx.fillText(options.remark2 ,options.width/2 - ctx.measureText(options.remark2).width/2 , options.height + options.remarkFontSize*2.2);
            if(!options.remark1 && options.remark2)
                ctx.fillText(options.remark2 ,options.width/2 - ctx.measureText(options.remark2).width/2 , options.height + options.remarkFontSize*0.8);
			return canvas;
        }

        
        
        

		// from Jon-Carlos Rivera (https://github.com/imbcmdth)
		var createTable	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.bizLinkId64);
			qrcode.make();
			
			// create table element
			var $table	= $('<table></table>')
				.css("width", options.width+"px")
				.css("height", options.height+"px")
				.css("border", "0px")
				.css("border-collapse", "collapse")
				.css('background-color', options.background);
		  
			// compute tileS percentage
			var tileW	= options.width / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the table
			for(var row = 0; row < qrcode.getModuleCount(); row++ ){
				var $row = $('<tr></tr>').css('height', tileH+"px").appendTo($table);
				
				for(var col = 0; col < qrcode.getModuleCount(); col++ ){
					$('<td></td>')
						.css('width', tileW+"px")
						.css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
						.appendTo($row);
				}	
			}
			// return just built canvas
			return $table;
		}
  

		return this.each(function(){
			var element	= options.render == "canvas" ? createCanvas() : createTable();
			$(element).appendTo(this);
		});
	};
})( jQuery );