import {alert_screen, alert_box, alert_confirm_ctrl_ok, alert_confirm_ctrl_cancel} from "./dom_service";
import {alertService} from "./alert_service";

export function confirmService () {
    return {
        raise: (msg, resolve, reject) => {          

            alert_box.classList.remove("pop", "error", "success");
            alert_box.querySelector(".alert-msg").innerHTML = msg;

            alert_confirm_ctrl_cancel.classList.remove("hidden");

            alert_confirm_ctrl_ok.onclick = function () {
                alertService().dismiss();
                resolve();
            };

            alert_confirm_ctrl_cancel.onclick = function () {
                alertService().dismiss();
                reject();
            };           

            alert_screen.classList.add("active");
            alert_box.classList.add("pop");
        }
    }
}