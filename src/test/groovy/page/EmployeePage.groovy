package page
import java.awt.Button;

import geb.Page

class EmployeePage extends Page {

	static at = {
		assert $("button").attr('id') == "open_form_btn"
	}

	static content = {
		messages { module MessagesModule , $('.notifyjs-corner') }

		addEmployee { $('#open_form_btn') }
		formEmployee {  module EmployeeFormModule , $('#form_div') }
	}
}
