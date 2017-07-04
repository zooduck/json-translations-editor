// DOM...
import {alert_screen, alert_box, alert_confirm_ctrl_cancel, alert_confirm_ctrl_ok} from "./dom_service";
// Services...
import {errorService} from "./error_service";

export function alertService () {
    return {
        raise: (errorKey, options = {msg: "", type: ""}) => {
            let errorMsg = "";
            let type = options.type || errorKey.split(".")[0];

            if (errorKey === "CUSTOM") {
                errorMsg = options.msg;
            } else {
                errorMsg = errorService().getMsg(errorKey);
            }

            alert_box.classList.remove("pop", "error", "success");
            alert_box.querySelector(".alert-msg").innerHTML = errorMsg;

            alert_confirm_ctrl_cancel.classList.add("hidden");          

            if (type.match(/error/i)) {              
                alert_box.classList.add("error");
            } else if (type.match(/success/i)) {               
                alert_box.classList.add("success");
            }
          
            alert_screen.classList.add("active");
            alert_box.classList.add("pop");

            alert_confirm_ctrl_ok.onclick = function () {
                alertService().dismiss();
            }       
        },
        dismiss: () => {
            alert_screen.classList.remove("active");
            alert_box.classList.remove("pop", "error", "success");
        }
    }
}
