import { NgModule } from '@angular/core';
import { Hmodal2Component } from './hmodal2/hmodal2';
import { VoteComponent } from './vote/vote';
@NgModule({
	declarations: [Hmodal2Component,
    VoteComponent],
	imports: [],
	exports: [Hmodal2Component,
    VoteComponent]
})
export class ComponentsModule {}
