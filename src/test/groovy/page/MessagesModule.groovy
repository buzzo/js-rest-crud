package page
import geb.Module

class MessagesModule extends Module {

	static content = {
		messages { $('.notifyjs-wrapper').search('.notifyjs-container div span') }
	}
}
