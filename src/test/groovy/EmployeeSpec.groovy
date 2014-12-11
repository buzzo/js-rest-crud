import geb.spock.GebReportingSpec
import page.EmployeePage

class EmployeeSpec extends GebReportingSpec {

	def "add successfully one user"() {
		when:
		to EmployeePage

		and:
		// click on add button
		addEmployee.click()
		// wait the modal open
		waitFor { formEmployee.isDisplayed()}

		and:
		// fill form
		formEmployee.employeeName << "emp 1"
		formEmployee.employeeCode << "code 1"
		formEmployee.employeeBadge << "badge 1"
		formEmployee.employeePosition << "position 1"

		and:
		// press add button
		formEmployee.addButton.click()
		
		then:
		// modal is closed
		waitFor { !formEmployee.isDisplayed()}
		// wait message show
		waitFor { messages[0].isDisplayed()}
		// message is show
		messages[0].text() == "Funcionário adicionado com sucesso!"
	}

}