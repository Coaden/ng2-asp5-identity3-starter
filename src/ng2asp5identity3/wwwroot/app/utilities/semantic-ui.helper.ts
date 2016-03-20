declare var jQuery: any;


export class SemanticPopupHelper {

    hideAll() {

        var popup = jQuery('.ui.popup').popup('hide all');
    }

    hide(selector: string) {

        var popup = jQuery(selector).popup('hide');
    }
}

export class SemanticSidebarHelper {

    hideAll() {
        var sidebar = jQuery('.ui.sidebar').sidebar('hide');
    }

    hide(selector: string) {

        var sidebar = jQuery(selector).sidebar('hide');
    }

    toggleAll() {

        var sidebar = jQuery('.ui.sidebar').sidebar('hide');
    }

    toggle(selector: string) {

        var sidebar = jQuery(selector).sidebar('hide');
    }
}
