import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.phantomjs.PhantomJSDriver

waiting { timeout = 2 }

// To run the tests with all browsers just run “./gradlew test”

environments {

	// run via “./gradlew chromeTest”
	chrome {
		driver = { new ChromeDriver() }
	}

	// run via “./gradlew firefoxTest”
	firefox {
		driver = { new FirefoxDriver() }
	}

	phantomJs {
		driver = { new PhantomJSDriver() }
	}

	reportsDir = "build/geb-reports"

}

// uncomment this if running inside IDE and already have wildfly running
//baseUrl = "http://localhost:8080/js-rest-crud"
