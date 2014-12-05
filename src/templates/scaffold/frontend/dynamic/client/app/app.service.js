'use strict';
<% 
    import grails.plugin.scaffold.core.ScaffoldingHelper

%>
angular.module('angularDemoApp')
  .factory('AutocompleteService', function(\$resource, appConfig){
  	var toLabel = function(model, labelProperties){
  		if(model){
  			var str = '';
			angular.forEach(labelProperties, function(label, i) {
				if(i > 0){
					str += ' ';
				}
				str += model[label];
			}, str);
			return str;
		}
	    return '';
  	};
  	var toAutocompleteObject = function(item, labelProperties, tagsOutput){
  		var obj = {id:item.id};
  		if(tagsOutput){
  			obj.name = _.map(labelProperties, function(label) { return item[label];  }).join(', ');
		}else{
			angular.forEach(labelProperties, function(label) {
			  obj[label] = item[label];
			}, item);
		}
        return obj;
  	};
  	
  	var resourceQuery = function(val, urlPart, labelProperties, excludes, tagsOutput){
  		var param = {limit: 15};
		param.query = val;
		param.excludes = excludes;
		var resource = \$resource(appConfig.restUrl + urlPart);
		return resource.query(param).\$promise.then(
	        function( response ){
		       	return response.map(function(item){
		       		return toAutocompleteObject(item, labelProperties, tagsOutput);
			    });
	       	}
     	);
  	};
  	var service = {
	
	<%
	List allEnums = []
	for(d in domainClasses){
  		//Lets find field to display in autocomplete 
		String useDisplaynamesStr = ScaffoldingHelper.getDomainClassDisplayNames(d, config).collect{key, value->"item." + key + ""}.join("+ ' ' +")
		if(!useDisplaynamesStr) useDisplaynamesStr = "item.id"
		ScaffoldingHelper sh = new ScaffoldingHelper(d, pluginManager, comparator, getClass().classLoader)
		excludes = sh.getProps().findAll{it.isAssociation()}
		enums = sh.getProps().findAll{it.type && it.isEnum()}
		allEnums +=enums
	
  		%>
  		${d.propertyName}Query : function(val, labelProperties, tagsOutput){
  			return resourceQuery(val, '${d.propertyName.toLowerCase()}s', labelProperties, '${excludes*.name.join(",")}', tagsOutput);
	    },
	    ${d.propertyName}FormatLabel : function(model, labelProperties) {
		    return toLabel(model, labelProperties);
		},
    <%}
	allEnums.unique{it.getTypePropertyName()}.each{p->
		println "\t${p.getTypePropertyName().replace(".", "")}List: ${(p.type.values()*.name()).collect{"'$it'"}},"
	}
	%>
    };
    return service;
  });
  
  
angular.module('angularDemoApp').factory('SessionService', function (\$localStorage) {
	var service = {};
	var _currentUser = {};
	
	service.afterLogin = function(userData){
    	_currentUser = userData;
    	// save settings to local storage
    	\$localStorage.userData = userData;
    };
    
    service.getCurrentUser = function(){
    	if(!_.isEmpty(_currentUser)){
    		return _currentUser;
    	}
    	
    	//get from local storage
    	if ( angular.isDefined(\$localStorage.userData) ) {
			_currentUser = \$localStorage.userData;
		}
		return	_currentUser;
    };
    
    return service;
});