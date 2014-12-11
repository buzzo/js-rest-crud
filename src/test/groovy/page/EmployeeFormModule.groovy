package page
import geb.Module

class EmployeeFormModule extends Module {

	static content = {
		employeeName { $('#name') }
		employeeCode { $('#code') }
		employeeBadge { $('#badge') }
		employeePosition { $('#position') }
		
		addButton { $('#frm-ok-btn') }
	}
}
