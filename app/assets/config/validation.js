const validation = {
	email: {
      empty: {
        message: 'Please enter an email address'
      },
      email: {
        message: 'Please enter a valid email address'
      }
	},
    
	password: {
      empty: {
        message: 'Please enter a password'
      },
      length: {
        minimum: 6,
        message: 'Your password must be at least 6 characters'
      }
	},

	name: {
      empty: {
        message: 'Please enter a name'
      },
      length: {
        minimum: 3,
        message: 'Your name must be minimum 3 characters'
      }
	},
	
	oRequired:{
		empty:{
			message: 'Please enter '
		}
	}
}

export function validate(nameField, value, title){
	var error = false;	
	if(validation.hasOwnProperty(nameField))
	{
		let v = validation[nameField];
		if(value == "" || value == null ){
			resp = v['empty']['message'];
			var error = true;
		} else if(v.hasOwnProperty('email')){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(value))
			{
				resp = 'Please enter a valid email address';
				var error = true;
			}            
		} else if(typeof v['length'] != "undefined")
		{
			if(value.length < v['length']['minimum'])
			{
				resp = v['length']['message'];
				var error = true;
			}
		}		
	}
	else
	{
		if(typeof value == 'undefined' || value == '' || value == null)
		{
			var error = true;
			resp = 'Please enter '+title
		}		
	}	
	if(error)
	{
		return message = {'status':0, 'message':resp}
	} else {
		return message = {'status':1, 'message':''}
	}
}