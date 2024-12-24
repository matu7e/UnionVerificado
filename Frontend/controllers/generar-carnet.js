

// Función para generar el PDF
async function generatePDF(dni, token) {
    try {
        // Obtener datos del miembro
        const { nombre, apellido, fecha_nacimiento, dni_miembro, escuela, cinto, imagen, grupo_sanguineo } = await fetchUserData(dni, token);
    
        // Función para formatear la fecha
        function formatearFecha(fechaISO) {
            const fecha = new Date(fechaISO);
            const dia = fecha.getDate().toString().padStart(2, '0'); // Día con dos dígitos
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes con dos dígitos
            const ano = fecha.getFullYear(); // Año completo
            return `${dia}/${mes}/${ano}`;
        }

        // Constante del DNI
        const dniBase64 = btoa(dni_miembro);
        const url = `http://127.0.0.1:5501/Frontend/validar.html?key=${dniBase64}`;
    
        // Definir valores por defecto
        const nombreText = nombre || "Nombre no disponible";
        const apellidoText = apellido || "Apellido no disponible";
        
        // Formatear la fecha de nacimiento si está disponible
        const fechaNacimientoText = fecha_nacimiento ? formatearFecha(fecha_nacimiento) : "Fecha de nacimiento no disponible";
        
        const escuelaText = escuela || "Union Mediterranea";
        const cintoText = cinto || "Cinto no disponible";
        const imageUrl = imagen ? `../../Backend/${imagen}` : '../../Backend/uploads/default.jpg'; // Usar imagen por defecto si es null    
        const grupoSanguineo = grupo_sanguineo;
    
        // Generar código QR
        const qrCodeDataUrl = await QRCode.toDataURL(url);

        const pdf = new jsPDF({
            format: 'a4',
            unit: 'mm',
            orientation: 'landscape'
        });

        // Dimensiones y posiciones de los rectángulos
        const rectFreWidth = 85;
        const rectFreHeight = 55;
        const pageFreWidth = pdf.internal.pageSize.width;
        const x0 = (pageFreWidth - rectFreWidth) / 2;
        const pageFreHeight = pdf.internal.pageSize.height;
        const y0 = (pageFreHeight - rectFreHeight) / 2;

        pdf.setFillColor(40, 116, 166);
        pdf.rect(x0 - 43, y0, rectFreWidth, rectFreHeight, 'F');

        const rectWidth = 85;
        const rectHeight = 55;
        const pageWidth = pdf.internal.pageSize.width;
        const x = (pageWidth - rectWidth) / 2;
        const pageHeight = pdf.internal.pageSize.height;
        const y = (pageHeight - rectHeight) / 2;

        pdf.rect(x + 43, y, rectWidth, rectHeight);

        
        pdf.addImage(qrCodeDataUrl, 'PNG', x + 101, y + 33, 20, 20, undefined, 'FAST', 0.8);

        // Imprimir el texto "CARNET DE MIEMBRO"
        pdf.setFont("times", "bold");
        pdf.setFontSize(11);
        pdf.text(x + 53, y + 8, "CREDENCIAL DE PRACTICANTE", { align: "center" });
        pdf.setFontSize(15);
        pdf.text(x - 13.5, y - 50, "UNION MEDITERRANEA DE TAEKWONDO", { align: "center" });
        
        // Insertar una línea debajo del texto
        pdf.setLineWidth(0.5);
        pdf.line(x - 15, y - 45, x + 98, y - 45);

        pdf.setTextColor(150, 174, 182);
        pdf.text(x - 10, y - 10, "FRENTE", { align: "center" });
        pdf.text(x + 75, y - 10, "DORSO", { align: "center" });

        pdf.setTextColor(255);
        pdf.setFontSize(8);
        pdf.text(x - 35, y + 42, "FEDERACION INTERNACIONAL DE TAEKWONDO", { align: "center" });

        // Insertar una línea debajo del texto
        pdf.setLineWidth(0.5);
        pdf.line(x - 40, y + 45, x + 38, y + 45);

        pdf.setFont("times", "bold");
        pdf.setFontSize(10);
        pdf.text(x - 37, y + 8, "UNION MEDITERRANEA DE TAEKWONDO", { align: "center" });
        pdf.setFontSize(8.5);
        pdf.text(x - 15 , y + 17, "Cordoba", { align: "center" });
        pdf.setFontSize(8.5);
        pdf.text(x , y + 17, "Argentina", { align: "center" });

        pdf.setFontSize(7);
        pdf.text(x - 39, y + 50, "Cortesía - Integridad - Perseverancia - Autocontrol - Espíritu Indomable", { align: "center" });


        //pdf.setTextColor(150, 174, 182);
        //pdf.setFontSize(12);
        //pdf.text(x - 43, y + 65, "Para validar esta credencial dirigirse a http://127.0.0.1:5501/Frontend/validator.html", { align: "center" });

        pdf.setTextColor(0);
        pdf.setFontSize(8);
        pdf.text(x - 45, y + 130, "Prohibida la venta, impresión, reproducción, comercialización y modificación de este documento. © UNION MEDITERRANEA DE CORDOBA", { align: "center" });

        // Cargar y agregar la imagen principal al PDF
        const image = new Image();
        image.src = imageUrl;

        image.onload = function () {
            pdf.addImage(image, 'PNG', x + 100, y + 12, 22, 22, undefined, 'FAST', 0.8);

            // Crear una nueva imagen para la marca de agua y otros logos
            const marcaAguaImage = new Image();
            const itf = new Image();
            const union = new Image();
            const log1 = new Image();
            const log2 = new Image();
            const log3 = new Image();
            const log4 = new Image();
            const log5 = new Image();
            const fechaActual = new Date();

            marcaAguaImage.src = '../../Backend/uploads/img-carnet/marca.png';
            itf.src = '../../Backend/uploads/img-carnet/ITF.png';
            union.src = '../../Backend/uploads/img-carnet/union.png';
            log1.src = '../../Backend/uploads/img-carnet/log1.png';
            log2.src = '../../Backend/uploads/img-carnet/log2.png';
            log3.src = '../../Backend/uploads/img-carnet/log3.png';
            log4.src = '../../Backend/uploads/img-carnet/log4.png';
            log5.src = '../../Backend/uploads/img-carnet/log5.png';

            log5.onload = function () {
                pdf.addImage(marcaAguaImage, 'PNG', x + 70, y + 12, 30, 30, undefined, 'FAST', 0.8);
                pdf.addImage(itf, 'PNG', x - 55, y - 70, 35, 35, undefined, 'FAST', 0.8);
                pdf.addImage(union, 'PNG', x + 105, y - 70, 35, 35, undefined, 'FAST', 0.8);
                pdf.addImage(log1, 'PNG', x + 18, y + 13, 22, 22);
                pdf.addImage(log2, 'PNG', x, y + 21, 13, 13);
                pdf.addImage(log3, 'PNG', x - 40, y + 13, 21, 21);
                pdf.addImage(log4, 'PNG', x - 14, y + 20, 13, 13);
                pdf.addImage(log5, 'PNG', x - 30, y + 65, 140, 60, undefined, 'FAST', 0.8);

                // Imprimir la información del miembro en el PDF
                pdf.setFont("times", "bold");
                pdf.setFontSize(10);
                pdf.text(x + 48, y + 16, "Nombre: ", { align: "left" });
                pdf.setFont("times", "normal");
                pdf.text(x + 63, y + 16, `${nombreText} ${apellidoText}`, { align: "left" });

                pdf.setFont("times", "bold");
                pdf.text(x + 48, y + 22, "F.N: ", { align: "left" });
                pdf.setFont("times", "normal");
                pdf.text(x + 57, y + 22, fechaNacimientoText, { align: "left" });

                pdf.setFont("times", "bold");
                pdf.text(x + 48, y + 28, "N° Doc: ", { align: "left" });
                pdf.setFont("times", "normal");
                pdf.text(x + 62, y + 28, String(dni_miembro), { align: "left" });

                pdf.setFont("times", "bold");
                pdf.text(x + 48, y + 34, "Escuela: ", { align: "left" });
                pdf.setFont("times", "normal");
                pdf.text(x + 62, y + 34, escuelaText, { align: "left" });

                pdf.setFont("times", "bold");
                pdf.text(x + 48, y + 40, "Cinto: ", { align: "left" });
                pdf.setFont("times", "normal");
                pdf.text(x + 60, y + 40, cintoText, { align: "left" });

                pdf.setFont("times", "bold");
                pdf.text(x + 48, y + 46, "Factor: ", { align: "left" });
                pdf.setFont("times", "normal");
                pdf.text(x + 60, y + 46, grupoSanguineo, { align: "left" });

                pdf.setFont("times", "bold");
                pdf.text(x + 75, y + 52, "Vigencia ", { align: "left" });
                pdf.setFont("times", "normal");
                pdf.text(x + 90, y + 52, String(fechaActual.getFullYear()), { align: "left" });


                // Guardar el PDF
                pdf.save(`Credencial_${dni_miembro}.pdf`);
            };
        };

    } catch (error) {
        console.error('Error al generar el PDF:', error);
    }
}
