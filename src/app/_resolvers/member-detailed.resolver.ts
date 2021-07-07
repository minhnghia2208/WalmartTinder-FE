import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Member } from "../_models/member";
import { MembersService } from "../_services/member.service";
@Injectable({
    providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member>{
    constructor(private memberService: MembersService){}
    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        var force_type = route.paramMap.get('username');
        if (force_type == null) force_type = "";
        return this.memberService.getMember(force_type);
    }

}