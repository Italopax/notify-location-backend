import { SendLocationDTO } from "@src/domain/types";
import { ILocationService } from "@src/services/interface/location.interface";
import { TYPES } from "@src/utils/inversify/inversify-types";
import { auth } from "@src/utils/middlewares/auth";
import { validateUserStatus } from "@src/utils/middlewares/validateUserStatus";
import { BaseHttpController, controller, httpGet, httpPost, interfaces, request, requestBody } from "inversify-express-utils";
import { inject } from "inversify";
import { Request } from "express";
import { StatusCodeResult } from "inversify-express-utils/lib/cjs/results";
import httpStatus from "http-status";

@controller('/location')
export class LocationController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.services.LOCATION_SERVICE) private readonly locationService: ILocationService,
  ) {
    super();
  }

  @httpPost('/', auth, validateUserStatus)
  private async sendLocation (
    @requestBody() locationData: SendLocationDTO,
    @request() { session }: Request,
  ): Promise<StatusCodeResult> {
    const locationDataDTO: SendLocationDTO = {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    };

    await this.locationService.sendLocation(session, locationDataDTO);
    return this.statusCode(httpStatus.NO_CONTENT);
  }
}