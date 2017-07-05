// DOM...
import {alert_screen, alert_box, alert_confirm_ctrl_cancel, alert_confirm_ctrl_ok} from "./dom_service";
// Services...
import {alertKeysService} from "./alert_keys_service";

export function alertService () {
    return {
        raise: (key, options = {msg: "", type: ""}) => {
            let msg = "";
            let type = options.type || key.split(".")[0];          

            if (key === "CUSTOM") {
                msg = options.msg;
            } else {
                msg = alertKeysService().getMsg(key);
            }

            let prefix = "";
            if (type.match(/ERROR/i)) {
               prefix = "<i class=\"ion-md-warning\">ERROR!</i>";
            }
            if (type.match(/SUCCESS/i)) {
                prefix = "<i class=\"ion-md-information-circle\">SUCCESS!</i>";
            }

            alert_confirm_ctrl_cancel.classList.add("hidden");

            alert_box.classList.remove("pop", "error", "success");
            alert_box.querySelector(".alert-msg").innerHTML = `${prefix}<div>${msg}</div>`;                     

            if (type.match(/error/i)) {              
                alert_box.classList.add("error");
            } else {
            // } else if (type.match(/success/i)) {              
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
