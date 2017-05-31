import { AfterViewInit, ChangeDetectorRef, Directive, EventEmitter, forwardRef, Input, OnInit, Output   } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

//This is needed to update the tinymce editor when the model gets changed
const CUSTOM_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SimpleTinyDirective),
    multi: true
}

@Directive({
    inputs: ['tinyEditor'],
    selector: '[tinyEditor]',
    providers: [CUSTOM_VALUE_ACCESSOR]
})
export class SimpleTinyDirective implements AfterViewInit, ControlValueAccessor {
    private val: any = "";
    private editor:any;
    private init: boolean = false;
    //selector string: Id of the host element
    @Input() selector: string;

    //Getter and setters for NgModel binding
    @Input()
    get ngModel() {
        return this.val;
    }

    set ngModel(val) {
        if (val != null || val != undefined){
            this.val = val;
        }
    }
        

    //This is used to update the model on view update
    @Output() ngModelChange = new EventEmitter();

    //All the options needed for tinymce editor
    private options = {
        plugins: ['link', 'paste', 'table'],
        toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        toolbar2: 'print preview media | forecolor backcolor emoticons | codesample',
        image_advtab: true
    }

    //ChangeDetectorRef is used to update angular component tree whenver a blur event occurs to trigger all the validations
    constructor(private changeDetectorRef: ChangeDetectorRef) {
    

    }

    //registerOnChange, registerOnTouched, writeValue are methods need to be implemented for the interface ControlValueAccessor
    onChange = (_:any) => { };
    onTouched = () => { };

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    //This method is called whenever model gets updated
    writeValue(value: any): void {
        //This check is necessary because, this method gets called before editor gets initialised. Hence undefined/null pointer exceptions gets thrown
        if (this.init) {
            if (tinymce.get(this.selector)) {
                if (value != undefined || value != null) {
                    tinymce.get(this.selector).setContent(value, { format: 'raw' });
                }
            }
        }

    }

    //Update the component tree only when blur event happens. Otherwise following bug will occur.
    //Cursor position changes to 0 or the begining of the editor after every event.
    valueChange() {
        this.valueOnChange(false);
    }

    valueOnChange(change: boolean) {
        if (tinymce.activeEditor) {
            this.val = tinymce.activeEditor.getContent();
        }
        this.ngModelChange.emit(this.val);
        if (change) {
            this.changeDetectorRef.detectChanges();
        }
    }

    ngAfterViewInit() {
       // console.log('TEST AfterViewInit');
        let that = this;
        let options: any = this.options;
        
        if (this.selector) {
            options['selector'] = '#' + this.selector;
        }
        else {
            options['selector'] = ".wysiwyg";
        }

        options['height'] = 100;
        options['schema'] = "html5";
        options['theme'] = "modern";

        //write the model value to tinymce editor once gets initialised. And track input and change events
        options['init_instance_callback'] = function (editor:any) {
            that.writeValue(that.ngModel);
            editor.on('change', function (e:any) {
                that.valueChange();
            });

            editor.on('blur', function (e:any) {
                that.valueOnChange(true);
            });

            editor.on('keyup', function (e: any) {
                that.valueChange();
            });
            editor.on('PastePostProcess', function (e:any) {
                that.valueChange();
            });
        }

        if (tinymce != null) {
            tinymce.init(options).then(() => {
                this.init = true;
            });
        }
    }
    ngOnDestroy() {
        if (tinymce) {
            tinymce.remove(this.editor);
        }
    }

}

