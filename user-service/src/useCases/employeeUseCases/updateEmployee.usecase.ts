import { Department, UpdateDepartments } from "../../entities/entityinterfaces.ts/department.interface";
import { UpdateEmployees } from "../../entities/entityinterfaces.ts/employee.inteface";
import CustomError from "../../utils/customErrorHandler";
import messageBroker from "../../utils/messageBroker";


class UpdateEmployee {
  constructor() { }
  async updateEmployeeById(employee: UpdateEmployees) {
    try {
      await messageBroker.sendMessage("update_employee", employee);
      // send message to the queue
      await messageBroker.listenForResponse("updated_employee");
      // listening to queue where other service processed the data and send to this service

      // wrapping event listener inside a promise
      const responsePromise = new Promise((resolve, reject) => {
        const eventListener = (data: Department) => { // event listener if data is success
          messageBroker.off("dataRecieved", eventListener);
          messageBroker.off("dataRecievedError", errorListener)
          resolve(data);
        };

        const errorListener = (error: CustomError) => { // event listener if data has error
          messageBroker.off("dataRecieved", eventListener);
          messageBroker.off("dataRecievedError", errorListener);
          if (error.message.includes('Record to update not found.')) {
            reject(new CustomError("Record to update not found.", 404))
          } else {
            reject(new CustomError(error.message, 500))
          }
        }
        messageBroker.on("dataRecieved", eventListener);
        messageBroker.on("dataRecievedError", errorListener);
        setTimeout(() => {
          messageBroker.off("dataRecieved", eventListener);
          messageBroker.off("dataRecievedError", errorListener);
          reject(new CustomError("Employee updation Response timed out", 504))
        }, 5000)
      });
      return await responsePromise
    } catch (error) {
      console.log("error updating employee : ", error);
      throw new CustomError(error.message, 500);
    }
  }
}

export default new UpdateEmployee()